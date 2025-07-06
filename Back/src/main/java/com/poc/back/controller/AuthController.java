package com.poc.back.controller;

import com.poc.back.domaine.Account;
import com.poc.back.domaine.LoginRequest;
import com.poc.back.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Permet d'éviter les erreurs CORS
public class AuthController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Account> userOptional = accountService.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            Account user = userOptional.get();
            if (loginRequest.getPassword().equals(user.getPassword())) {  
                // Retourner un objet JSON au lieu d'un simple texte
                return ResponseEntity.ok(Map.of("token", "fake-jwt-token"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}