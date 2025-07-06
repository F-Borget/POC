package com.poc.back.controller;

import com.poc.back.domaine.Account;
import com.poc.back.service.jwt.AccountServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/me")
public class ConnectedController {

    private AccountServiceImpl accountService;

    @Autowired
    public void UserController(AccountServiceImpl accountService) {
        this.accountService = accountService;
    }

    public ConnectedController(AccountServiceImpl accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<Account> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            System.out.println("🔴 Requête non authentifiée !");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String username = authentication.getName();
        System.out.println("📢 Requête `/me` pour l'utilisateur : " + username);

        Optional<Account> user = accountService.getAccountByUsername(username);
        if (user.isEmpty()) {
            System.out.println("🔴 Aucun utilisateur trouvé pour : " + username);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }
}
