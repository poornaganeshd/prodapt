package com.prodapt.presentation.service;

import com.prodapt.presentation.dto.GeneratedDeck;
import com.prodapt.presentation.dto.Slide;
import com.prodapt.presentation.exception.GenerationException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class ClaudeClient {

    private static final Logger log = LoggerFactory.getLogger(ClaudeClient.class);

    private static final String SYSTEM_PROMPT = """
            You are a presentation-building assistant. Given the user's idea, topic, or document text,
            design a clear, well-structured slide deck.

            Respond with ONLY a single valid JSON object. No markdown, no code fences, no commentary
            before or after. The JSON MUST match this exact schema and key names:

            {
              "title": "string",
              "slides": [
                {
                  "slideNumber": 1,
                  "heading": "string",
                  "bulletPoints": ["string"],
                  "speakerNotes": "string",
                  "visualRecommendation": "string"
                }
              ],
              "audienceQuestions": ["string"]
            }

            Rules:
            - "slideNumber" is a 1-based integer, sequential.
            - Produce between 5 and 8 slides, including a title/intro slide and a closing slide.
            - Each slide has 3 to 5 short, punchy "bulletPoints".
            - "speakerNotes" is 2 to 3 sentences the presenter would say aloud.
            - "visualRecommendation" is a short suggestion for a chart, image, or layout for that slide.
            - "audienceQuestions" lists 3 to 5 questions the audience is likely to ask.
            - Return only the JSON object, nothing else.
            """;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final String anthropicVersion;
    private final int maxTokens;

    public ClaudeClient(
            ObjectMapper objectMapper,
            @Value("${claude.api-key}") String apiKey,
            @Value("${claude.model}") String model,
            @Value("${claude.base-url}") String baseUrl,
            @Value("${claude.version}") String anthropicVersion,
            @Value("${claude.max-tokens}") int maxTokens) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
        this.anthropicVersion = anthropicVersion;
        this.maxTokens = maxTokens;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public GeneratedDeck generate(String userText) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new GenerationException(
                    "Claude API key is not configured. Set CLAUDE_API_KEY in the backend .env file.");
        }

        String requestBody = buildRequestBody(userText);
        HttpResponse<String> response;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl))
                    .timeout(Duration.ofSeconds(90))
                    .header("content-type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", anthropicVersion)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (java.io.IOException e) {
            throw new GenerationException("Could not reach the Claude API. Check your network and try again.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new GenerationException("Generation was interrupted. Please try again.", e);
        }

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            log.warn("Claude API returned status {}: {}", response.statusCode(), truncate(response.body()));
            throw new GenerationException(
                    "The Claude API returned an error (status " + response.statusCode() + "). Please try again.");
        }

        String modelText = extractText(response.body());
        return parseAndValidate(modelText);
    }

    private String buildRequestBody(String userText) {
        Map<String, Object> root = new LinkedHashMap<>();
        root.put("model", model);
        root.put("max_tokens", maxTokens);
        root.put("system", SYSTEM_PROMPT);
        root.put("messages", List.of(
                Map.of("role", "user", "content", userText),
                // Prefill the assistant turn with "{" to force a JSON-only response.
                Map.of("role", "assistant", "content", "{")
        ));

        try {
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new GenerationException("Failed to build the request to Claude.", e);
        }
    }

    private String extractText(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode content = root.path("content");
            if (!content.isArray() || content.isEmpty()) {
                throw new GenerationException("Claude returned an empty response. Please try again.");
            }
            StringBuilder sb = new StringBuilder();
            for (JsonNode block : content) {
                if ("text".equals(block.path("type").asText())) {
                    sb.append(block.path("text").asText());
                }
            }
            // Re-attach the prefilled "{" that started the assistant turn.
            return "{" + sb;
        } catch (GenerationException e) {
            throw e;
        } catch (Exception e) {
            throw new GenerationException("Could not read Claude's response.", e);
        }
    }

    private GeneratedDeck parseAndValidate(String modelText) {
        String json = isolateJson(modelText);
        GeneratedDeck deck;
        try {
            deck = objectMapper.readValue(json, GeneratedDeck.class);
        } catch (Exception e) {
            log.warn("Malformed JSON from Claude: {}", truncate(modelText));
            throw new GenerationException("Claude returned malformed output. Please try again.", e);
        }

        if (deck.title() == null || deck.title().isBlank()) {
            throw new GenerationException("Generated deck is missing a title. Please try again.");
        }
        if (deck.slides() == null || deck.slides().isEmpty()) {
            throw new GenerationException("Generated deck has no slides. Please try again.");
        }
        for (Slide slide : deck.slides()) {
            if (slide.heading() == null || slide.heading().isBlank()) {
                throw new GenerationException("A generated slide is missing a heading. Please try again.");
            }
            if (slide.bulletPoints() == null || slide.bulletPoints().isEmpty()) {
                throw new GenerationException("A generated slide has no bullet points. Please try again.");
            }
        }
        return deck;
    }

    /**
     * Strips code fences if present and returns the substring from the first '{' to the last '}'.
     */
    private String isolateJson(String text) {
        String cleaned = text.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("(?s)^```(json)?", "").replaceFirst("(?s)```\\s*$", "").trim();
        }
        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return cleaned.substring(start, end + 1);
        }
        return cleaned;
    }

    private String truncate(String value) {
        if (value == null) {
            return "";
        }
        return value.length() > 500 ? value.substring(0, 500) + "..." : value;
    }
}
