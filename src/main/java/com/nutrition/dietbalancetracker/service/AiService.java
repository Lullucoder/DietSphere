package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * AI SERVICE
 * ==========
 * Communicates with a local Ollama instance to provide AI-powered
 * nutrition coaching. Enriches prompts with the user's actual diet data
 * so the AI can give personalised, context-aware advice.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AiService {

    private final DietaryEntryRepository dietaryEntryRepository;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2:3b}")
    private String ollamaModel;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Send a chat message to Ollama with the user's nutritional context.
     *
     * @param userId              The logged-in user's ID
     * @param userMessage         The message typed by the user
     * @param conversationHistory Previous messages in the conversation (role + content)
     * @return The AI-generated reply text
     */
    public String chat(Long userId, String userMessage, List<Map<String, String>> conversationHistory) {
        try {
            // 1) Build nutritional context from today's meals
            String dietContext = buildDietContext(userId);

            // 2) System prompt
            String systemPrompt = buildSystemPrompt(dietContext);

            // 3) Assemble messages list for Ollama /api/chat
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            if (conversationHistory != null) {
                messages.addAll(conversationHistory);
            }
            messages.add(Map.of("role", "user", "content", userMessage));

            // 4) Call Ollama
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", ollamaModel);
            requestBody.put("messages", messages);
            requestBody.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    ollamaBaseUrl + "/api/chat", entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> message = (Map<String, Object>) response.getBody().get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }

            return "I'm sorry, I couldn't generate a response. Please try again.";

        } catch (Exception e) {
            log.error("Error calling Ollama: {}", e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("Connection refused")) {
                return "⚠️ **Ollama is not running.** Please start Ollama on your machine:\n\n"
                        + "1. Run `ollama serve` in a terminal\n"
                        + "2. Pull the model: `ollama pull " + ollamaModel + "`\n"
                        + "3. Come back and try again!";
            }
            return "I encountered an error while processing your request. Please ensure Ollama is running and try again.";
        }
    }

    /** Quick connectivity check. */
    public boolean isOllamaAvailable() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(ollamaBaseUrl + "/api/tags", String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    /* ---- private helpers ---- */

    private String buildDietContext(Long userId) {
        try {
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

    private String buildSystemPrompt(String dietContext) {
        return """
                You are NutriBot, a friendly and knowledgeable AI nutrition assistant for the NutriTrack diet balance tracking app.

                Your role:
                - Help users understand their nutrition intake and nutrient gaps
                - Suggest meals and foods to balance their diet
                - Provide evidence-based dietary advice
                - Recommend Indian foods (both North and South Indian) when relevant since the food database is predominantly Indian cuisine
                - Be encouraging and supportive about their health journey

                Important guidelines:
                - Keep responses concise (2-4 paragraphs max unless asked for detail)
                - Use bullet points for lists
                - Include specific food suggestions with approximate calorie/nutrient info when helpful
                - Always be supportive and non-judgmental
                - If you don't know something, say so honestly
                - Never provide medical diagnosis or replace professional medical advice
                - Use emojis sparingly to keep the tone friendly

                Current user diet data:
                """ + dietContext;
    }
}
