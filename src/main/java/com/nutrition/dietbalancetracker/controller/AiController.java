package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.AiChatRequestDTO;
import com.nutrition.dietbalancetracker.dto.AiChatResponseDTO;
import com.nutrition.dietbalancetracker.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI CONTROLLER
 * =============
 * Exposes REST endpoints for the AI chat feature powered by a local Ollama instance.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AiController {

    private final AiService aiService;

    /**
     * POST /api/ai/chat
     * Send a message to the AI and receive a reply enriched with the user's diet data.
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponseDTO> chat(@RequestBody AiChatRequestDTO request) {
        String reply = aiService.chat(request.getUserId(), request.getMessage(), request.getHistory());
        return ResponseEntity.ok(new AiChatResponseDTO(reply, true));
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
