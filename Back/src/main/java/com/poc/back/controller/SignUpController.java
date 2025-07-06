package com.poc.back.controller;

import com.poc.back.domaine.RegisterRequest;
import com.poc.back.service.AuthServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/register")
public class SignUpController {

    private final AuthServiceImpl authService;

    public SignUpController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
