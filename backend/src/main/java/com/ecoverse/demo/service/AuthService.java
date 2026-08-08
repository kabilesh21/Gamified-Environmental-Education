package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.*;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.JwtTokenProvider;
import com.ecoverse.demo.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    private final Random random = new Random();

    @Transactional
    public void registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        // Assign automatic profile picture seed based on user's name
        String defaultProfilePic = "https://api.dicebear.com/7.x/fun-emoji/svg?seed=" + signUpRequest.getFullName().replaceAll("\\s+", "");

        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .institutionName(signUpRequest.getInstitutionName())
                .grade(signUpRequest.getGrade())
                .department(signUpRequest.getDepartment())
                .profilePicture(defaultProfilePic)
                .otp(otp)
                .otpExpiry(expiry)
                .enabled(false) // Needs OTP confirmation
                .xp(0)
                .level(1)
                .currentStreak(0)
                .coins(0)
                .treeXp(0)
                .treeLevel(1)
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        // Send OTP
        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Transactional
    public boolean verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        User user = userRepository.findByEmail(verifyOtpRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        if (user.getOtp() == null || !user.getOtp().equals(verifyOtpRequest.getOtp())) {
            if ("123456".equals(verifyOtpRequest.getOtp())) {
                // Accept mock bypass OTP
            } else {
                throw new IllegalArgumentException("Invalid OTP!");
            }
        }

        if (!"123456".equals(verifyOtpRequest.getOtp()) && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired!");
        }

        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        return true;
    }

    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        if (user.isEnabled()) {
            throw new IllegalArgumentException("Account is already verified!");
        }

        String otp = String.format("%06d", random.nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public JwtResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("Please verify your account using the OTP sent to your email!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(loginRequest.getEmail());

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User loggedInUser = principal.getUser();

        return JwtResponse.builder()
                .token(jwt)
                .email(loggedInUser.getEmail())
                .fullName(loggedInUser.getFullName())
                .role(loggedInUser.getRole())
                .xp(loggedInUser.getXp())
                .level(loggedInUser.getLevel())
                .streak(loggedInUser.getCurrentStreak())
                .coins(loggedInUser.getCoins())
                .treeLevel(loggedInUser.getTreeLevel())
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with this email!"));

        String otp = String.format("%06d", random.nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            if ("123456".equals(request.getOtp())) {
                // Accept mock bypass OTP
            } else {
                throw new IllegalArgumentException("Invalid OTP!");
            }
        }

        if (!"123456".equals(request.getOtp()) && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }
}
