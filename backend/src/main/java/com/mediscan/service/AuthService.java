package com.mediscan.service;

import com.mediscan.dto.*;
import com.mediscan.entity.*;
import com.mediscan.exception.BadRequestException;
import com.mediscan.repository.*;
import com.mediscan.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public ApiResponse registerPatient(PatientRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .status(Status.ACTIVE)
                .build();
        userRepository.save(user);

        Patient patient = Patient.builder()
                .user(user)
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .phoneNumber(request.getPhoneNumber())
                .build();
        patientRepository.save(patient);

        return ApiResponse.success("Patient registered successfully");
    }

    @Transactional
    public ApiResponse registerDoctor(DoctorRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new BadRequestException("License number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DOCTOR)
                .status(Status.PENDING)
                .build();
        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(user)
                .specialization(request.getSpecialization())
                .experience(request.getExperience())
                .licenseNumber(request.getLicenseNumber())
                .approvalStatus(Status.PENDING)
                .build();
        doctorRepository.save(doctor);

        return ApiResponse.success("Doctor registered successfully. Pending admin approval.");
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Check user status
        if (user.getStatus() == Status.BLOCKED) {
            throw new BadRequestException("Account blocked");
        }
        if (user.getStatus() == Status.SUSPENDED) {
            throw new BadRequestException("Account suspended");
        }
        if (user.getRole() == Role.DOCTOR && user.getStatus() == Status.PENDING) {
            throw new BadRequestException("Doctor account pending admin approval");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(jwt)
                .role(user.getRole().name())
                .email(user.getEmail())
                .name(user.getName())
                .status(user.getStatus().name())
                .id(user.getId())
                .build();
    }
}
