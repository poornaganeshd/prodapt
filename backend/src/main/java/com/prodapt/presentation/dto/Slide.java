package com.prodapt.presentation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Slide(
        int slideNumber,
        String heading,
        List<String> bulletPoints,
        String speakerNotes,
        String visualRecommendation
) {
}
