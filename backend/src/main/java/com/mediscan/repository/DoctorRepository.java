package com.mediscan.repository;

import com.mediscan.entity.Doctor;
import com.mediscan.entity.Status;
import com.mediscan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByApprovalStatus(Status status);
    boolean existsByLicenseNumber(String licenseNumber);
}
