package com.mediscan.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false)
    private String specialization;

    private Integer experience;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    private Status approvalStatus;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Phase 1 - Scheduling Core
    @Column(name = "working_hours_start")
    private LocalTime workingHoursStart;

    @Column(name = "working_hours_end")
    private LocalTime workingHoursEnd;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (workingHoursStart == null) workingHoursStart = LocalTime.of(9, 0);
        if (workingHoursEnd == null) workingHoursEnd = LocalTime.of(17, 0);
        if (slotDurationMinutes == null) slotDurationMinutes = 30;
    }
}
