package com.poc.back.domaine;

import jakarta.persistence.*;
import java.util.Random;

@Entity
@Table(name = "projets")
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long managerId;

    @Column(nullable = false, unique = true)
    private String name;

    private String color;

    // Constructeur par défaut
    public Projet() {}

    // Constructeur avec génération de couleur aléatoire
    public Projet(String name, Long managerId) {
        this.name = name;
        this.managerId = managerId;
        this.color = generateRandomColor();
    }

    // Génère une couleur hexadécimale aléatoire
    public String generateRandomColor() {
        Random random = new Random();
        return String.format("#%06x", random.nextInt(0xFFFFFF + 1));
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
