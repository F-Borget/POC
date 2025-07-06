package com.poc.back.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.poc.back.domaine.Projet;

public interface ProjetRepository extends JpaRepository<Projet, Long> {

}
