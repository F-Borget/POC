package com.poc.back.controller;

import com.poc.back.dao.AccountRepository;
import com.poc.back.domaine.Account;
import com.poc.back.domaine.Projet;
import com.poc.back.domaine.WorkSession;
import com.poc.back.service.ProjetService;
import com.poc.back.service.WorkSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/work-sessions")
public class WorkSessionController {

    private final WorkSessionService workSessionService;
    private final AccountRepository accountRepository;
    private final ProjetService projetService; // Utilisation correcte du service

    @Autowired
    public WorkSessionController(WorkSessionService workSessionService, AccountRepository accountRepository, ProjetService projetService) {
        this.workSessionService = workSessionService;
        this.accountRepository = accountRepository;
        this.projetService = projetService; // Injection correcte
    }

    // Ajouter une session de travail
    @PostMapping
    public ResponseEntity<?> saveWorkSession(@RequestBody WorkSession workSession, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Utilisateur non authentifié");
        }

        // Récupération de l'utilisateur connecté
        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        workSession.setAccount(account); // Associer l'utilisateur à la session de travail

        // Vérification que le projet existe bien en base
        if (workSession.getProjet() == null || workSession.getProjet().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Projet invalide ou manquant");
        }

        Optional<Projet> projetOpt = projetService.findById(workSession.getProjet().getId());
        if (projetOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Projet non trouvé");
        }

        workSession.setProjet(projetOpt.get()); // Associer le projet récupéré

        // Enregistrer la session
        WorkSession savedSession = workSessionService.saveWorkSession(workSession);
        return ResponseEntity.ok(savedSession);
    }

    // Récupérer toutes les sessions de travail de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<List<WorkSession>> getUserWorkSessions(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Account account = accountRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé !"));

        List<WorkSession> workSessions = workSessionService.getWorkSessionsByAccount(account.getId());
        return ResponseEntity.ok(workSessions);
    }

    // Récupérer les sessions de travail d'un utilisateur spécifique (Manager)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkSession>> getWorkSessionsByUser(@PathVariable Long userId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Vérifier que l'utilisateur est bien un manager
        Account managerAccount = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!"ROLE_MANAGER".equals(managerAccount.getRole()) && !"ROLE_ADMIN".equals(managerAccount.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // Vérifier que l'utilisateur à gérer existe
        Optional<Account> userAccount = accountRepository.findById(userId);
        if (userAccount.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Récupérer les sessions de travail de l'utilisateur donné
        List<WorkSession> workSessions = workSessionService.getWorkSessionsByAccount(userId);
        return ResponseEntity.ok(workSessions);
    }
}
