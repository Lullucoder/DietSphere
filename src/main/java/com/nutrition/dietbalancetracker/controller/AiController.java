package com.nutrition.dietbalancetracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nutrition.dietbalancetracker.dto.AiChatRequestDTO;
import com.nutrition.dietbalancetracker.dto.AiChatResponseDTO;
import com.nutrition.dietbalancetracker.model.ChatMessage;
import com.nutrition.dietbalancetracker.repository.ChatMessageRepository;
import com.nutrition.dietbalancetracker.service.AiService;

import lombok.RequiredArgsConstructor;

/**
 * AI CONTROLLER
 * =============
 * Exposes REST endpoints for the AI chat feature powered by a local Ollama instance.
 * Also manages persistent chat history stored in the database.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final ChatMessageRepository chatMessageRepository;

    /**
     * POST /api/ai/chat
     * Send a message to the AI and receive a reply enriched with the user's diet data.
     * Both the user message and the assistant reply are persisted to the database.
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponseDTO> chat(@RequestBody AiChatRequestDTO request) {
        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setUserId(request.getUserId());
        userMsg.setRole("user");
        userMsg.setContent(request.getMessage());
        chatMessageRepository.save(userMsg);

        // Get AI reply
        String reply = aiService.chat(request.getUserId(), request.getMessage(), request.getHistory());

        // Save assistant reply
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setUserId(request.getUserId());
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(reply);
        chatMessageRepository.save(assistantMsg);

        return ResponseEntity.ok(new AiChatResponseDTO(reply, true));
    }

    /**
     * GET /api/ai/history?userId=X
     * Retrieve the full chat history for a user, ordered by creation time.
     */
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(@RequestParam Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);
        return ResponseEntity.ok(messages);
    }

    /**
     * DELETE /api/ai/history?userId=X
     * Delete ALL chat messages for a user.
     */
    @DeleteMapping("/history")
    @Transactional
    public ResponseEntity<Map<String, String>> clearHistory(@RequestParam Long userId) {
        chatMessageRepository.deleteByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "Chat history cleared"));
    }

    /**
     * DELETE /api/ai/history/{id}?userId=X
     * Delete a single chat message by its ID (only if it belongs to the user).
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long id, @RequestParam Long userId) {
        ChatMessage msg = chatMessageRepository.findById(id).orElse(null);
        if (msg == null || !msg.getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        chatMessageRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Message deleted"));
    }

    /**
     * GET /api/ai/status
     * Quick check whether the Ollama backend is reachable.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        boolean available = aiService.isOllamaAvailable();
        return ResponseEntity.ok(Map.of(
                "ollamaAvailable", available,
                "message", available ? "Ollama is running and ready" : "Ollama is not reachable. Run 'ollama serve' to start it."
        ));
    }
}
