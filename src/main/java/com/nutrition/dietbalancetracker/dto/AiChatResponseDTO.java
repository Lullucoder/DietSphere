package com.nutrition.dietbalancetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiChatResponseDTO {
    private String reply;
    private boolean ollamaAvailable;
    private boolean aiAvailable;
    private String provider;

    public AiChatResponseDTO(String reply, boolean available, String provider) {
        this.reply = reply;
        this.ollamaAvailable = available;
        this.aiAvailable = available;
        this.provider = provider;
    }
}
