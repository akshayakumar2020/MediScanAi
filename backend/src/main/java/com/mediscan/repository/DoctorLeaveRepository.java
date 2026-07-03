package com.mediscan.repository;

import com.mediscan.entity.Doctor;
import com.mediscan.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {
    List<DoctorLeave> findByDoctorAndLeaveDateBetween(Doctor doctor, LocalDate start, LocalDate end);
    List<DoctorLeave> findByDoctorAndLeaveDate(Doctor doctor, LocalDate date);
}
