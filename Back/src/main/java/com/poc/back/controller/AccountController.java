package com.poc.back.controller;

import com.poc.back.dao.AccountRepository;
import com.poc.back.dao.WorkSessionRepository;
import com.poc.back.domaine.Account;
import com.poc.back.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/register/accounts")
@CrossOrigin(origins = "*") // Permet d'accéder depuis Angular
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private WorkSessionRepository workSessionRepository;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Account> getAccountById(@PathVariable Long id) {
        return accountService.findById(id);
    }

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account savedAccount = accountService.save(account);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAccount);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount) {
        Optional<Account> existingAccount = accountRepository.findById(id);

        if (existingAccount.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Compte non trouvé"));
        }

        Account account = existingAccount.get();
        if (updatedAccount.getRole() != null) {
            account.setRole(updatedAccount.getRole());
        }
        if (Objects.nonNull(updatedAccount.getManagerId())) {
            account.setManagerId(updatedAccount.getManagerId());
        }

        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("message", "Compte mis à jour avec succès !"));
    }

    @GetMapping("/managed-users")
    public ResponseEntity<List<Account>> getManagedUsers(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String managerUsername = authentication.getName();
        Optional<Account> manager = accountRepository.findByUsername(managerUsername);

        if (manager.isEmpty() || !"ROLE_MANAGER".equals(manager.get().getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<Account> managedUsers = accountRepository.findByManagerId(manager.get().getId());
        return ResponseEntity.ok(managedUsers);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            // 🔥 Supprimer les sessions associées à cet utilisateur AVANT de le supprimer
            workSessionRepository.deleteByAccountId(id);

            // 🔥 Maintenant, supprimer le compte utilisateur
            accountRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("message", "Compte supprimé avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur: " + e.getMessage());
        }
    }
}
