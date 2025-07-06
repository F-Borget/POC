package com.poc.back.controller;

import com.poc.back.dao.LoginResponse;
import com.poc.back.domaine.Account;
import com.poc.back.domaine.LoginRequest;
import com.poc.back.service.jwt.AccountServiceImpl;
import com.poc.back.utils.JwtUtil;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final AccountServiceImpl accountService;
    private final JwtUtil jwtUtil;

    public LoginController(AuthenticationManager authenticationManager, AccountServiceImpl accountService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identifiants invalides");
        }


        Optional<Account> accountOptional = accountService.getAccountByUsername(loginRequest.getUsername());
        if (accountOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé.");
        }

        Account account = accountOptional.get();


        String jwt = jwtUtil.generateToken(account.getUsername(), account.getRole());

        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}
