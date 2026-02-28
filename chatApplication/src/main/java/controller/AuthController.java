/*package controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;
import entity.User;
import service.AuthService;
import service.FileStorageService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> register(
            @RequestPart("user") @Validated User user,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        try {
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                FileInfo fileInfo = fileStorageService.store(profilePhoto);
                user.setProfilePhotoUrl(fileInfo.getUrl());
            }
            User registered = authService.register(user);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage().contains("already exists") ? "Username already exists" : "Registration failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        logger.info("Login attempt for: {}", user.getUsername());
        try {
            User loggedIn = authService.login(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(loggedIn);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(error);
        }
    }
}*/

package controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;
import entity.User;
import service.AuthService;
import service.FileStorageService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> register(
            @RequestPart("user") @Validated User user,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        try {
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                FileInfo fileInfo = fileStorageService.store(profilePhoto);
                user.setProfilePhotoUrl(fileInfo.getUrl());
            }
            User registered = authService.register(user);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage().contains("already exists") ? "Username already exists" : "Registration failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        logger.info("Login attempt for: {}", user.getUsername());
        try {
            User loggedIn = authService.login(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(loggedIn);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(error);
        }
    }
}