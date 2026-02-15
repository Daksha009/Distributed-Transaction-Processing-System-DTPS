package com.example.dtps.controller;

import com.example.dtps.model.Transaction;
import com.example.dtps.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/tx")
    public ResponseEntity<Transaction> processTransaction(
            @jakarta.validation.Valid @RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.processTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthMetrics() {
        return ResponseEntity.ok(transactionService.getSystemMetrics());
    }
}
