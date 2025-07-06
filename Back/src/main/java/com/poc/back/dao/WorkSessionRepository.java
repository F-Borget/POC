package com.poc.back.dao;

import com.poc.back.domaine.WorkSession;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkSessionRepository extends JpaRepository<WorkSession, Long> {

    // Récupérer toutes les sessions d'un utilisateur
    List<WorkSession> findByAccountId(Long accountId);

    // Supprimer toutes les sessions associées à un utilisateur avant de le supprimer
    @Modifying
    @Transactional
    @Query("DELETE FROM WorkSession w WHERE w.account.id = :userId")
    void deleteByAccountId(@Param("userId") Long userId);
}
