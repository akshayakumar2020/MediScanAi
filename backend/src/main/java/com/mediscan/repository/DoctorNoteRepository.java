package com.mediscan.repository;

import com.mediscan.entity.Doctor;
import com.mediscan.entity.DoctorNote;
import com.mediscan.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorNoteRepository extends JpaRepository<DoctorNote, Long> {
    List<DoctorNote> findByReport(MedicalReport report);
    List<DoctorNote> findByDoctor(Doctor doctor);
}
