package com.mediscan.repository;

import com.mediscan.entity.GoogleCredential;
import com.mediscan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GoogleCredentialRepository extends JpaRepository<GoogleCredential, Long> {
    Optional<GoogleCredential> findByUser(User user);
}
