package com.prodapt.presentation.service;

import com.prodapt.presentation.exception.BadRequestException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class DocumentTextExtractor {

    private static final long MAX_TEXT_LENGTH = 20000;

    public String extract(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please choose a file to upload.");
        }

        String name = file.getOriginalFilename();
        String extension = name == null ? "" : name.substring(name.lastIndexOf('.') + 1).toLowerCase();

        String text;
        try {
            text = switch (extension) {
                case "txt", "md" -> new String(file.getBytes(), StandardCharsets.UTF_8);
                case "pdf" -> fromPdf(file.getBytes());
                case "docx" -> fromDocx(file.getInputStream());
                default -> throw new BadRequestException(
                        "Unsupported file type. Upload a PDF, DOCX, TXT, or MD file.");
            };
        } catch (IOException e) {
            throw new BadRequestException("Could not read the uploaded file. Please try again.", e);
        }

        if (text == null || text.isBlank()) {
            throw new BadRequestException("No readable text was found in the document.");
        }

        text = text.strip();
        if (text.length() > MAX_TEXT_LENGTH) {
            text = text.substring(0, (int) MAX_TEXT_LENGTH);
        }
        return text;
    }

    private String fromPdf(byte[] bytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(bytes)) {
            return new PDFTextStripper().getText(document);
        }
    }

    private String fromDocx(InputStream input) throws IOException {
        try (XWPFDocument document = new XWPFDocument(input);
                XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }
}
