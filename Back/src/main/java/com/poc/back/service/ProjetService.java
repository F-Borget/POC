package com.poc.back.service;

import com.poc.back.dao.ProjetRepository;
import com.poc.back.domaine.Projet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjetService {

    private final ProjetRepository projetRepository;

    @Autowired
    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    // Récupérer tous les projets
    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    // Ajouter un projet
    public Projet addProjet(Projet projet) {
        return projetRepository.save(projet);
    }

    public Optional<Projet> findById(Long id) {
        return projetRepository.findById(id);
    }

    public boolean deleteProjet(Long id) {
        Optional<Projet> projet = projetRepository.findById(id);

        if (projet.isPresent()) {
            projetRepository.deleteById(id);
            return true; // Retourne vrai si le projet a bien été supprimé
        } else {
            return false; // Retourne faux si le projet n'existe pas
        }
    }
}
