package com.poc.back.service;

import com.poc.back.domaine.WorkSession;
import com.poc.back.dao.WorkSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkSessionService {
    private final WorkSessionRepository workSessionRepository;

    @Autowired
    public WorkSessionService(WorkSessionRepository workSessionRepository) {
        this.workSessionRepository = workSessionRepository;
    }

    public WorkSession saveWorkSession(WorkSession workSession) {
        return workSessionRepository.save(workSession);
    }

    public List<WorkSession> getWorkSessionsByAccount(Long accountId) {
        return workSessionRepository.findByAccountId(accountId);
    }
}
