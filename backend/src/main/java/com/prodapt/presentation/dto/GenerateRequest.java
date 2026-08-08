package com.prodapt.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GenerateRequest(
        @NotBlank(message = "Please enter a topic or some text to generate a presentation.")
        @Size(max = 20000, message = "Input is too long. Keep it under 20000 characters.")
        String text
) {
}
