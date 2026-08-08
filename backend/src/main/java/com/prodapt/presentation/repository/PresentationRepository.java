package com.prodapt.presentation.repository;

import com.prodapt.presentation.domain.Presentation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

    List<Presentation> findAllByOrderByCreatedAtDesc();
}
