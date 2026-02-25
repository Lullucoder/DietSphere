package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * INTERVENTION ENTITY
 * ===================
 * Stores alerts for persistent nutrient deficiencies.
 */
@Entity
@Table(name = "interventions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Intervention {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Who needs this intervention?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Which deficiency triggered this?
    @ManyToOne
    @JoinColumn(name = "deficiency_id", nullable = false)
    private NutrientDeficiency deficiency;
    
    // How urgent is this?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterventionLevel level;
    
    // How many days has this persisted?
    @Column(nullable = false)
    private Integer consecutiveDays;
    
    // Message to show the user
    @Column(nullable = false, length = 1000)
    private String message;
    
    // Has the user acknowledged this?
    @Column(nullable = false)
    private Boolean isAcknowledged = false;
    
    // Was an email sent?
    @Column(nullable = false)
    private Boolean emailSent = false;
    
    // When was this created?
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // When did user acknowledge it?
    private LocalDateTime acknowledgedAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
