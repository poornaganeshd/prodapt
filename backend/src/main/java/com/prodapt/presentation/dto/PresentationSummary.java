package com.prodapt.presentation.dto;

import java.time.Instant;

public record PresentationSummary(
        Long id,
        String title,
        Instant createdAt
) {
}
