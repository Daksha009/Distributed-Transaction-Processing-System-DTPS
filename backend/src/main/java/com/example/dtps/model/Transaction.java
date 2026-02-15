package com.example.dtps.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Sender is required")
    private String sender;

    @jakarta.validation.constraints.NotBlank(message = "Receiver is required")
    private String receiver;

    @jakarta.validation.constraints.NotNull(message = "Amount is required")
    @jakarta.validation.constraints.Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private LocalDateTime timestamp;
    private String receiptUrl; // URL from S3/Storage

    public Transaction() {
    }

    public Transaction(Long id, String sender, String receiver, BigDecimal amount, LocalDateTime timestamp,
            String receiptUrl) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = timestamp;
        this.receiptUrl = receiptUrl;
    }

    public Transaction(String sender, String receiver, BigDecimal amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getReceiptUrl() {
        return receiptUrl;
    }

    public void setReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }
}
