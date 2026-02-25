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
}
