package com.poc.back.controller;

import com.poc.back.domaine.Projet;
import com.poc.back.service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projets")
public class ProjetsController {

    private final ProjetService projetService;

    @Autowired
    public ProjetsController(ProjetService projetService) {
        this.projetService = projetService;
    }

    @GetMapping
    public ResponseEntity<List<Projet>> getProjets(Authentication authentication,
                                                   @RequestHeader(value = "Authorization", required = false) String authHeader) {

        System.out.println("📢 Requête reçue avec Authorization: " + authHeader);

        if (authentication == null) {
            System.out.println("🔴 Requête non authentifiée !");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("🟢 Accès autorisé pour : " + authentication.getName());

        // 🔴 CHANGER ICI : Retourner la vraie liste des projets
        List<Projet> projets = projetService.getAllProjets();
        return ResponseEntity.ok(projets);
    }

    @PostMapping
    public ResponseEntity<?> addProjet(@RequestBody Projet projet, Authentication authentication) {
        if (authentication == null) {
            System.out.println("🔴 Requête non authentifiée !");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vous devez être connecté pour ajouter un projet.");
        }

        System.out.println("🟢 Ajout d'un projet par : " + authentication.getName());

        // Vérifier si le projet a un nom valide
        if (projet.getName() == null || projet.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le nom du projet est requis.");
        }

        // Générer une couleur aléatoire si elle n'est pas définie
        if (projet.getColor() == null || projet.getColor().isEmpty()) {
            projet.setColor(projet.generateRandomColor());
        }

        try {
            Projet newProjet = projetService.addProjet(projet);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProjet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'ajout du projet : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        boolean deleted = projetService.deleteProjet(id);

        if (deleted) {
            return ResponseEntity.noContent().build(); // ✅ Retourne 204 (No Content)
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // ✅ Retourne 404 si le projet n'existe pas
        }
    }
}
