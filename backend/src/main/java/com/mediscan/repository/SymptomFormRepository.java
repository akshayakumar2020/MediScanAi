package com.mediscan.repository;

import com.mediscan.entity.Appointment;
import com.mediscan.entity.SymptomForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SymptomFormRepository extends JpaRepository<SymptomForm, Long> {
    Optional<SymptomForm> findByAppointment(Appointment appointment);
}
