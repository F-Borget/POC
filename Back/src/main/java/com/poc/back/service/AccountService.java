package com.poc.back.service;

import com.poc.back.dao.AccountRepository;
import com.poc.back.dao.WorkSessionRepository;
import com.poc.back.domaine.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Optional<Account> findById(Long id) {
        return accountRepository.findById(id);
    }

    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    // Sauvegarde sans hachage du mot de passe
    public Account save(Account account) {
        // Ne pas hacher le mot de passe, le stocker tel quel
        return accountRepository.save(account);
    }

    // Vérification du mot de passe en clair
    public boolean checkPassword(String rawPassword, String storedPassword) {
        return rawPassword.equals(storedPassword);
    }

    public List<Account> findAllAccounts() {
        return accountRepository.findAll();
    }
}
