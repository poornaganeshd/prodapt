package com.prodapt.presentation.web;

import com.prodapt.presentation.dto.GenerateRequest;
import com.prodapt.presentation.dto.PresentationResponse;
import com.prodapt.presentation.dto.PresentationSummary;
import com.prodapt.presentation.service.PresentationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/presentations")
public class PresentationController {

    private final PresentationService service;

    public PresentationController(PresentationService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public ResponseEntity<PresentationResponse> generate(@Valid @RequestBody GenerateRequest request) {
        PresentationResponse response = service.generate(request.text());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<PresentationSummary> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public PresentationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }
}
