package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * DEFICIENCY THRESHOLD ENTITY
 * ============================
 * Stores the recommended daily amounts for each nutrient by age group.
 * Admins can configure these values.
 */
@Entity
@Table(name = "deficiency_thresholds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeficiencyThreshold {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Which age group is this for?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AgeGroup ageGroup;
    
    // Which nutrient?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Nutrient nutrient;
    
    // What's the daily requirement?
    @Column(nullable = false)
    private Double dailyRequirement;
    
    // Is this a critical nutrient that triggers interventions?
    @Column(nullable = false)
    private Boolean isCritical = false;
    
    // When was this last updated?
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Which admin updated this?
    @ManyToOne
    @JoinColumn(name = "updated_by_admin_id")
    private User updatedBy;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
