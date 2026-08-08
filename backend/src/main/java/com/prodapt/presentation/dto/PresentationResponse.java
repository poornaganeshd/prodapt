package com.prodapt.presentation.dto;

import java.time.Instant;

public record PresentationResponse(
        Long id,
        String title,
        GeneratedDeck deck,
        Instant createdAt
) {
}
