package com.example.dtps.service;

import com.example.dtps.model.Transaction;
import com.example.dtps.repository.TransactionRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepository repository;
    private final StorageService storageService;

    public TransactionService(TransactionRepository repository, StorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }

    @CircuitBreaker(name = "transactionService", fallbackMethod = "fallbackTransaction")
    public Transaction processTransaction(Transaction tx) {
        // Validation logic
        if (tx.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        tx.setTimestamp(LocalDateTime.now());
        
        // Save first to generate ID (if IDENTITY strategy used, depends on DB)
        // If we want ID in receipt, we might need to save first.
        Transaction savedTx = repository.save(tx);

        // Upload to Cloud Setup
        String receiptUrl = storageService.uploadReceipt(savedTx);
        savedTx.setReceiptUrl(receiptUrl);

        return repository.save(savedTx);
    }

    public Transaction fallbackTransaction(Transaction tx, Throwable t) {
        // Fallback logic when circuit is open or DB fails
        System.err.println("Fallback triggered due to: " + t.getMessage());
        tx.setReceiptUrl("FAILED_TO_PROCESS_CIRCUIT_OPEN");
        return tx; 
    }

    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("jvm.memory.free", Runtime.getRuntime().freeMemory());
        metrics.put("jvm.memory.total", Runtime.getRuntime().totalMemory());
        metrics.put("db.connection.status", "UP"); // Simplified check
        return metrics;
    }
}
