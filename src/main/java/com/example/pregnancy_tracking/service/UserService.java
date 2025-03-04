package com.example.pregnancy_tracking.service;

import com.example.pregnancy_tracking.dto.AuthResponse;
import com.example.pregnancy_tracking.dto.ChangePasswordRequest;
import com.example.pregnancy_tracking.dto.LoginRequest;
import com.example.pregnancy_tracking.dto.RegisterRequest;
import com.example.pregnancy_tracking.entity.User;
import com.example.pregnancy_tracking.entity.Role;
import com.example.pregnancy_tracking.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.pregnancy_tracking.security.*;
import lombok.RequiredArgsConstructor;
import com.example.pregnancy_tracking.dto.UserDTO;
import com.example.pregnancy_tracking.entity.UserProfile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    // Remove PasswordEncoder since we're not using it
    
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());  // Store password directly
        user.setRole(Role.MEMBER);

        userRepository.save(user);
        return "User registered successfully!";
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);  // Truyền user thay vì email
        return new AuthResponse(token);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Direct password comparison
        if (!user.getPassword().equals(request.getOldPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(request.getNewPassword());  // Store new password directly
        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(user, user.getUserProfile()))
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));
        return new UserDTO(user, user.getUserProfile());
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));

        UserProfile userProfile = user.getUserProfile();
        if (userProfile == null) {
            userProfile = new UserProfile();
            userProfile.setUser(user);
            user.setUserProfile(userProfile);
        }

        // Cập nhật thông tin cơ bản
        if (userDTO.getUsername() != null)
            user.setUsername(userDTO.getUsername());
        if (userDTO.getEmail() != null)
            user.setEmail(userDTO.getEmail());

        // Cập nhật thông tin profile
        if (userDTO.getFullName() != null)
            userProfile.setFullName(userDTO.getFullName());
        if (userDTO.getPhoneNumber() != null)
            userProfile.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getAvatar() != null)
            userProfile.setAvatar(userDTO.getAvatar());

        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser, savedUser.getUserProfile());
    }
}
