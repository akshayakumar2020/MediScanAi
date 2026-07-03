package com.mediscan.repository;

import com.mediscan.entity.Appointment;
import com.mediscan.entity.Doctor;
import com.mediscan.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDesc(Doctor doctor);
    List<Appointment> findByDoctorAndAppointmentDateBetweenAndStatusNotIgnoreCase(Doctor doctor, java.time.LocalDateTime start, java.time.LocalDateTime end, String status);
    List<Appointment> findByDoctorAndAppointmentDateBetweenAndStatusIgnoreCase(Doctor doctor, java.time.LocalDateTime start, java.time.LocalDateTime end, String status);
    
    boolean existsByDoctorAndAppointmentDateAndStatusNotIgnoreCase(Doctor doctor, java.time.LocalDateTime appointmentDate, String status);
}
