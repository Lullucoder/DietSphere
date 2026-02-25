package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * NUTRIENT DEFICIENCY ENTITY
 * ===========================
 * Records when a user is not getting enough of a specific nutrient.
 */
@Entity
@Table(name = "nutrient_deficiencies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutrientDeficiency {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Which analysis detected this deficiency?
    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    private NutrientAnalysis analysis;
    
    // Which nutrient is deficient?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Nutrient nutrient;
    
    // How much did they actually consume?
    @Column(nullable = false)
    private Double actualIntake;
    
    // How much should they have consumed?
    @Column(nullable = false)
    private Double recommendedIntake;
    
    // What percentage are they deficient? (0-100)
    @Column(nullable = false)
    private Double deficiencyPercentage;
    
    // How severe is this deficiency?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeficiencyLevel level;
    
    // When was this detected?
    @Column(nullable = false)
    private LocalDateTime detectedAt;
    
    @PrePersist
    protected void onCreate() {
        this.detectedAt = LocalDateTime.now();
    }
}
