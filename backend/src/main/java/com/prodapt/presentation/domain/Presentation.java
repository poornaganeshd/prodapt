package com.prodapt.presentation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "presentations")
public class Presentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "raw_input", columnDefinition = "LONGTEXT", nullable = false)
    private String rawInput;

    @Column(name = "generated_json", columnDefinition = "LONGTEXT", nullable = false)
    private String generatedJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Presentation() {
    }

    public Presentation(String title, String rawInput, String generatedJson) {
        this.title = title;
        this.rawInput = rawInput;
        this.generatedJson = generatedJson;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getRawInput() {
        return rawInput;
    }

    public String getGeneratedJson() {
        return generatedJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
