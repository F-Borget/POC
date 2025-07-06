package com.poc.back.service;

import com.poc.back.dao.AccountRepository;
import com.poc.back.domaine.Account;
import com.poc.back.domaine.RegisterRequest;
import com.poc.back.domaine.LoginRequest;
import com.poc.back.dao.LoginResponse;
import com.poc.back.service.jwt.AccountServiceImpl;
import com.poc.back.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AccountServiceImpl accountService; // Utilisé pour charger l'utilisateur

    public AuthServiceImpl(AccountRepository accountRepository, PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                           AccountServiceImpl accountService) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.accountService = accountService;
    }

    /**
     * Inscription d'un utilisateur
     */
    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        Optional<Account> existingUser = accountRepository.findByUsername(request.getUsername());

        if (existingUser.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "L'utilisateur existe déjà.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Account newAccount = new Account();
        newAccount.setUsername(request.getUsername());
        newAccount.setPassword(passwordEncoder.encode(request.getPassword()));
        newAccount.setFirstname(request.getFirstname());
        newAccount.setLastname(request.getLastname());
        newAccount.setRole(request.getRole());

        accountRepository.save(newAccount);

        // Réponse sous forme d'un objet JSON
        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur créé avec succès !");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authentification de l'utilisateur et génération d'un JWT
     */
    public ResponseEntity<LoginResponse> authenticate(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );


            Optional<Account> accountOptional = accountRepository.findByUsername(request.getUsername());
            if (accountOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Account account = accountOptional.get();
            String token = jwtUtil.generateToken(account.getUsername(), account.getRole());

            return ResponseEntity.ok(new LoginResponse(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
