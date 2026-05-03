package com.nutrition.dietbalancetracker.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AI SERVICE
 * ==========
 * Communicates with Ollama or Gemini to provide AI-powered nutrition
 * coaching. Enriches prompts with the user's actual diet data so the AI
 * can give personalised, context-aware advice.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AiService {

    private final DietaryEntryRepository dietaryEntryRepository;
    private final UserRepository userRepository;

    @Value("${ai.provider:auto}")
    private String aiProvider;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2:3b}")
    private String ollamaModel;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String geminiBaseUrl;

    @Value("${gemini.model:gemini-3-flash-preview}")
    private String geminiModel;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    private static final int CONNECT_TIMEOUT_MS = 5000;
    private static final int READ_TIMEOUT_MS = 15000;

    private final RestTemplate restTemplate = createRestTemplate();

    /**
     * Send a chat message to the configured AI provider with the user's
     * nutritional context.
     *
     * @param userId              The logged-in user's ID
     * @param userMessage         The message typed by the user
     * @param conversationHistory Previous messages in the conversation (role + content)
     * @return The AI-generated reply text
     */
    public String chat(Long userId, String userMessage, List<Map<String, String>> conversationHistory) {
        try {
            String dietContext = buildDietContext(userId);
            String profileContext = buildProfileContext(userId);
            String systemPrompt = buildSystemPrompt(dietContext, profileContext);
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            if (conversationHistory != null) {
                messages.addAll(conversationHistory);
            }
            messages.add(Map.of("role", "user", "content", userMessage));
            AiProvider provider = resolveProvider();
            return switch (provider) {
                case OLLAMA -> chatWithOllama(messages);
                case GEMINI -> chatWithGemini(messages);
                case NONE -> buildUnavailableMessage();
            };
        } catch (RestClientResponseException e) {
            log.warn("AI provider returned error status {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return buildProviderErrorMessage();
        } catch (org.springframework.web.client.RestClientException e) {
            log.warn("AI provider not available: {}", e.getMessage());
            return buildProviderErrorMessage();
        } catch (Exception e) {
            log.error("Unexpected error calling AI provider", e);
            return buildProviderErrorMessage();
        }
    }

    /** Quick connectivity check for the currently selected provider strategy. */
    public boolean isAiAvailable() {
        return resolveProvider() != AiProvider.NONE;
    }

    public String getActiveProviderName() {
        return switch (resolveProvider()) {
            case OLLAMA -> "ollama";
            case GEMINI -> "gemini";
            case NONE -> "none";
        };
    }

    public boolean isOllamaAvailable() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(ollamaBaseUrl + "/api/tags", String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isGeminiAvailable() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return false;
        }

        try {
            HttpHeaders headers = jsonHeaders();
            headers.set("X-goog-api-key", geminiApiKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            String endpoint = geminiBaseUrl + "/models/" + normalizeGeminiModel();
            String url = addGeminiApiKey(endpoint);
            HttpMethod method = Objects.requireNonNull(HttpMethod.GET);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    method,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (org.springframework.web.client.RestClientException e) {
            return false;
        }
    }

    /* ---- private helpers ---- */

    private String chatWithOllama(List<Map<String, String>> messages) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", ollamaModel);
        requestBody.put("messages", messages);
        requestBody.put("stream", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, jsonHeaders());
        HttpMethod method = Objects.requireNonNull(HttpMethod.POST);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            ollamaBaseUrl + "/api/chat",
            method,
            entity,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (response.getStatusCode().is2xxSuccessful() && body != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) body.get("message");
            if (message != null) {
                Object content = message.get("content");
                if (content instanceof String text && !text.isBlank()) {
                    return text;
                }
            }
        }

        return "I'm sorry, I couldn't generate a response. Please try again.";
    }

    private String chatWithGemini(List<Map<String, String>> messages) {
        Map<String, Object> requestBody = buildGeminiRequest(messages, true);
        try {
            return executeGeminiRequest(requestBody);
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == 400) {
                // Fallback: simple prompt without systemInstruction or roles
                Map<String, Object> fallbackBody = buildGeminiFallbackRequest(messages);
                return executeGeminiRequest(fallbackBody);
            }
            throw e;
        }
    }

    private List<Map<String, Object>> buildGeminiContents(List<Map<String, String>> messages) {
        List<Map<String, Object>> contents = new ArrayList<>();
        for (Map<String, String> message : messages) {
            String role = Objects.equals(message.get("role"), "assistant") ? "model" : "user";
            if (Objects.equals(message.get("role"), "system")) {
                continue;
            }
            String content = message.get("content");
            if (content == null || content.isBlank()) {
                continue;
            }

            contents.add(Map.of(
                    "role", role,
                    "parts", List.of(Map.of("text", content))
            ));
        }
        return contents;
    }

    private Object extractGeminiText(Map<String, Object> responseBody) {
        Object candidatesObj = responseBody.get("candidates");
        if (!(candidatesObj instanceof List<?> candidates) || candidates.isEmpty()) {
            return null;
        }

        Object firstCandidate = candidates.get(0);
        if (!(firstCandidate instanceof Map<?, ?> candidateMap)) {
            return null;
        }

        Object contentObj = candidateMap.get("content");
        if (!(contentObj instanceof Map<?, ?> contentMap)) {
            return null;
        }

        Object partsObj = contentMap.get("parts");
        if (!(partsObj instanceof List<?> parts) || parts.isEmpty()) {
            return null;
        }

        StringBuilder reply = new StringBuilder();
        for (Object part : parts) {
            if (part instanceof Map<?, ?> partMap) {
                Object text = partMap.get("text");
                if (text instanceof String value && !value.isBlank()) {
                    if (reply.length() > 0) {
                        reply.append("\n");
                    }
                    reply.append(value);
                }
            }
        }
        return reply.toString();
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private Map<String, Object> buildGeminiRequest(List<Map<String, String>> messages, boolean includeSystem) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", buildGeminiContents(messages));
        if (includeSystem) {
            String systemInstruction = extractSystemInstruction(messages);
            if (systemInstruction != null && !systemInstruction.isBlank()) {
                requestBody.put("systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", systemInstruction))
                ));
            }
        }

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        requestBody.put("generationConfig", generationConfig);
        return requestBody;
    }

    private Map<String, Object> buildGeminiFallbackRequest(List<Map<String, String>> messages) {
        String prompt = buildFallbackPrompt(messages);
        Map<String, Object> fallbackBody = new HashMap<>();
        fallbackBody.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        return fallbackBody;
    }

    private String executeGeminiRequest(Map<String, Object> requestBody) {
        HttpHeaders headers = jsonHeaders();
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String endpoint = geminiBaseUrl + "/models/" + normalizeGeminiModel() + ":generateContent";
        String url = addGeminiApiKey(endpoint);
        HttpMethod method = Objects.requireNonNull(HttpMethod.POST);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                method,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (response.getStatusCode().is2xxSuccessful() && body != null) {
            Object text = extractGeminiText(body);
            if (text instanceof String reply && !reply.isBlank()) {
                return reply;
            }
        }

        return "I'm sorry, I couldn't generate a response. Please try again.";
    }

    private String addGeminiApiKey(String endpoint) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return endpoint;
        }
        return UriComponentsBuilder.fromHttpUrl(endpoint)
                .queryParam("key", geminiApiKey)
                .toUriString();
    }

    private String normalizeGeminiModel() {
        if (geminiModel == null) {
            return "";
        }
        String model = geminiModel.trim();
        if (model.startsWith("models/")) {
            model = model.substring("models/".length());
        }
        return model;
    }

    private String extractSystemInstruction(List<Map<String, String>> messages) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, String> message : messages) {
            if (!Objects.equals(message.get("role"), "system")) {
                continue;
            }
            String content = message.get("content");
            if (content == null || content.isBlank()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append("\n");
            }
            sb.append(content);
        }
        return sb.length() > 0 ? sb.toString() : null;
    }

    private String buildFallbackPrompt(List<Map<String, String>> messages) {
        StringBuilder sb = new StringBuilder();
        String systemInstruction = extractSystemInstruction(messages);
        if (systemInstruction != null && !systemInstruction.isBlank()) {
            sb.append(systemInstruction).append("\n\n");
        }

        for (Map<String, String> message : messages) {
            String role = message.get("role");
            String content = message.get("content");
            if (content == null || content.isBlank()) {
                continue;
            }
            if ("assistant".equals(role)) {
                sb.append("Assistant: ").append(content).append("\n");
            } else if ("user".equals(role)) {
                sb.append("User: ").append(content).append("\n");
            }
        }

        return sb.toString().trim();
    }

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(CONNECT_TIMEOUT_MS);
        factory.setReadTimeout(READ_TIMEOUT_MS);
        return new RestTemplate(factory);
    }

    private AiProvider resolveProvider() {
        String provider = aiProvider == null ? "auto" : aiProvider.trim().toLowerCase();
        return switch (provider) {
            case "ollama" -> isOllamaAvailable() ? AiProvider.OLLAMA : AiProvider.NONE;
            case "gemini" -> isGeminiAvailable() ? AiProvider.GEMINI : AiProvider.NONE;
            case "auto" -> {
                if (isOllamaAvailable()) {
                    yield AiProvider.OLLAMA;
                }
                if (isGeminiAvailable()) {
                    yield AiProvider.GEMINI;
                }
                yield AiProvider.NONE;
            }
            default -> {
                log.warn("Unknown ai.provider value: {}. Falling back to auto.", aiProvider);
                if (isOllamaAvailable()) {
                    yield AiProvider.OLLAMA;
                }
                if (isGeminiAvailable()) {
                    yield AiProvider.GEMINI;
                }
                yield AiProvider.NONE;
            }
        };
    }

    private String buildUnavailableMessage() {
        String configuredProvider = normalizedProviderSetting();

        if ("gemini".equals(configuredProvider)) {
            if (!isGeminiAvailable()) {
                return "Gemini is selected for the chatbot, but GEMINI_API_KEY is missing on the backend deployment.";
            }
            return "Gemini is selected for the chatbot, but the backend could not use it. Check GEMINI_API_KEY, GEMINI_MODEL, and deployment logs.";
        }

        if ("ollama".equals(configuredProvider)) {
            return "Ollama is selected for the chatbot, but the Ollama server is not reachable from this backend.";
        }

        if (!isGeminiAvailable() && !isOllamaAvailable()) {
            return "No AI provider is configured on the backend. Set AI_PROVIDER=gemini and add GEMINI_API_KEY in your deployment settings.";
        }

        return "No AI provider is currently available. Check the backend AI configuration and deployment logs.";
    }

    private String buildProviderErrorMessage() {
        String configuredProvider = normalizedProviderSetting();

        if ("gemini".equals(configuredProvider) || ("auto".equals(configuredProvider) && isGeminiAvailable())) {
            return "Gemini chat is configured, but the backend request failed. Check GEMINI_API_KEY, GEMINI_MODEL, and your Railway deployment logs.";
        }

        if ("ollama".equals(configuredProvider)) {
            return "Ollama chat is configured, but the Ollama server is not reachable from this backend.";
        }

        return buildUnavailableMessage();
    }

    private String normalizedProviderSetting() {
        return aiProvider == null ? "auto" : aiProvider.trim().toLowerCase();
    }

    private enum AiProvider {
        OLLAMA,
        GEMINI,
        NONE
    }

    private String buildProfileContext(Long userId) {
        try {
            if (userId == null) {
                return "User profile not available.";
            }
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) return "User profile not available.";

            StringBuilder sb = new StringBuilder();
            sb.append(String.format("User profile: Age %d", user.getAge()));

            if (user.getWeightKg() != null) {
                sb.append(String.format(", Weight: %.1f kg", user.getWeightKg()));
            }
            if (user.getHeightCm() != null) {
                sb.append(String.format(", Height: %.0f cm", user.getHeightCm()));
            }
            if (user.getBmi() != null) {
                sb.append(String.format(", BMI: %.1f (%s)", user.getBmi(), user.getBmiCategory()));
            }
            return sb.toString();
        } catch (Exception e) {
            log.error("Error building profile context: {}", e.getMessage());
            return "User profile not available.";
        }
    }

    private String buildDietContext(Long userId) {
        try {
            if (userId == null) {
                return "Unable to fetch today's meal data.";
            }
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            List<DietaryEntry> todayEntries =
                    dietaryEntryRepository.findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(userId, startOfDay, endOfDay);

            if (todayEntries.isEmpty()) {
                return "The user has not logged any meals today.";
            }

            StringBuilder ctx = new StringBuilder("Today's logged meals:\n");
            double totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;

            for (DietaryEntry entry : todayEntries) {
                String name = entry.getFoodItem() != null ? entry.getFoodItem().getName() : "Unknown";
                double portions = entry.getPortionSize();
                String mealType = entry.getMealType() != null ? entry.getMealType().name() : "OTHER";

                double cal = 0, pro = 0, carb = 0, fat = 0;
                if (entry.getFoodItem() != null && entry.getFoodItem().getNutrientProfile() != null) {
                    var np = entry.getFoodItem().getNutrientProfile();
                    cal = np.getCalories() * portions;
                    pro = np.getProtein() * portions;
                    carb = np.getCarbohydrates() * portions;
                    fat = np.getFat() * portions;
                }

                ctx.append(String.format("- %s (%.1f servings, %s): %.0f kcal, %.1fg protein, %.1fg carbs, %.1fg fat%n",
                        name, portions, mealType, cal, pro, carb, fat));
                totalCal += cal;
                totalPro += pro;
                totalCarb += carb;
                totalFat += fat;
            }

            ctx.append(String.format("%nDaily totals so far: %.0f kcal, %.1fg protein, %.1fg carbs, %.1fg fat", totalCal, totalPro, totalCarb, totalFat));
            return ctx.toString();

        } catch (Exception e) {
            log.error("Error building diet context: {}", e.getMessage());
            return "Unable to fetch today's meal data.";
        }
    }

    private String buildSystemPrompt(String dietContext, String profileContext) {
        return """
                You are NutriBot, a friendly and knowledgeable AI nutrition assistant for the DietSphere diet balance tracking app.

                Your role:
                - Help users understand their nutrition intake and nutrient gaps
                - Suggest meals and foods to balance their diet
                - Provide evidence-based dietary advice
                - Recommend Indian foods (both North and South Indian) when relevant since the food database is predominantly Indian cuisine
                - Be encouraging and supportive about their health journey
                - Tailor your advice to the user's BMI category:
                  * Underweight (BMI < 18.5): Suggest calorie-dense, nutrient-rich foods to gain healthy weight
                  * Normal (BMI 18.5-24.9): Maintain balanced diet, focus on nutrient diversity
                  * Overweight (BMI 25-29.9): Suggest lower-calorie, high-fiber, high-protein meals
                  * Obese (BMI >= 30): Focus on sustainable calorie reduction, fiber-rich foods, lean proteins

                Important guidelines:
                - Keep responses concise (2-4 paragraphs max unless asked for detail)
                - Use bullet points for lists
                - Include specific food suggestions with approximate calorie/nutrient info when helpful
                - Always be supportive and non-judgmental about weight/BMI
                - If you don't know something, say so honestly
                - Never provide medical diagnosis or replace professional medical advice
                - Use emojis sparingly to keep the tone friendly

                Current user profile:
                """ + profileContext + "\n\n"
                + "Current user diet data:\n" + dietContext;
    }
}
