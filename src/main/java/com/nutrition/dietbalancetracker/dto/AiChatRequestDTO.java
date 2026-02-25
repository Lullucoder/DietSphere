package com.nutrition.dietbalancetracker.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AiChatRequestDTO {
    private String message;
    private Long userId;
    private List<Map<String, String>> history;
}
