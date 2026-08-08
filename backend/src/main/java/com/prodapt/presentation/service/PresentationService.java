package com.prodapt.presentation.service;

import com.prodapt.presentation.domain.Presentation;
import com.prodapt.presentation.dto.GeneratedDeck;
import com.prodapt.presentation.dto.PresentationResponse;
import com.prodapt.presentation.dto.PresentationSummary;
import com.prodapt.presentation.exception.GenerationException;
import com.prodapt.presentation.exception.NotFoundException;
import com.prodapt.presentation.repository.PresentationRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

@Service
public class PresentationService {

    private final PresentationRepository repository;
    private final GroqClient groqClient;
    private final DocumentTextExtractor documentTextExtractor;
    private final ObjectMapper objectMapper;

    public PresentationService(
            PresentationRepository repository,
            GroqClient groqClient,
            DocumentTextExtractor documentTextExtractor,
            ObjectMapper objectMapper) {
        this.repository = repository;
        this.groqClient = groqClient;
        this.documentTextExtractor = documentTextExtractor;
        this.objectMapper = objectMapper;
    }

    public PresentationResponse generateFromDocument(MultipartFile file) {
        String text = documentTextExtractor.extract(file);
        return generate(text);
    }

    public PresentationResponse generate(String inputText) {
        GeneratedDeck deck = groqClient.generate(inputText);

        String generatedJson;
        try {
            generatedJson = objectMapper.writeValueAsString(deck);
        } catch (Exception e) {
            throw new GenerationException("Failed to serialize the generated deck.", e);
        }

        Presentation saved = repository.save(
                new Presentation(deck.title(), inputText, generatedJson));

        return new PresentationResponse(saved.getId(), saved.getTitle(), deck, saved.getCreatedAt());
    }

    public List<PresentationSummary> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> new PresentationSummary(p.getId(), p.getTitle(), p.getCreatedAt()))
                .toList();
    }

    public PresentationResponse getById(Long id) {
        Presentation presentation = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Presentation " + id + " was not found."));
        GeneratedDeck deck = deserialize(presentation.getGeneratedJson());
        return new PresentationResponse(
                presentation.getId(), presentation.getTitle(), deck, presentation.getCreatedAt());
    }

    private GeneratedDeck deserialize(String json) {
        try {
            return objectMapper.readValue(json, GeneratedDeck.class);
        } catch (Exception e) {
            throw new GenerationException("Stored presentation data is corrupted.", e);
        }
    }
}
