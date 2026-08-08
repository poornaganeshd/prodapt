package com.prodapt.presentation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeneratedDeck(
        String title,
        List<Slide> slides,
        List<String> audienceQuestions
) {
}
