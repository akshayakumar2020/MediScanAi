package com.mediscan.ocr;

import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
@Slf4j
public class OcrService {

    @Value("${ocr.tessdata.path}")
    private String tessdataPath;

    @Value("${ocr.language}")
    private String language;

    public String extractText(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            if (contentType == null) return "Unable to determine file type";

            if (contentType.equals("application/pdf")) {
                return extractFromPdf(file);
            } else if (contentType.startsWith("image/")) {
                return extractFromImage(file);
            }

            return "Unsupported file type: " + contentType;
        } catch (Exception e) {
            log.error("OCR extraction error: {}", e.getMessage());
            return "OCR extraction failed. Text could not be extracted from the uploaded file. Error: " + e.getMessage();
        }
    }

    private String extractFromPdf(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("pdf_", ".pdf");
        file.transferTo(tempFile);

        try (PDDocument document = Loader.loadPDF(tempFile)) {
            // First try text extraction
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text != null && !text.trim().isEmpty() && text.trim().length() > 50) {
                return text;
            }

            // Fall back to OCR for scanned PDFs
            PDFRenderer renderer = new PDFRenderer(document);
            StringBuilder ocrText = new StringBuilder();
            for (int i = 0; i < document.getNumberOfPages(); i++) {
                BufferedImage image = renderer.renderImageWithDPI(i, 300);
                ocrText.append(performOcr(image));
                ocrText.append("\n--- Page ").append(i + 1).append(" ---\n");
            }
            return ocrText.toString();
        } finally {
            tempFile.delete();
        }
    }

    private String extractFromImage(MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());
        return performOcr(image);
    }

    private String performOcr(BufferedImage image) {
        try {
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath(tessdataPath);
            tesseract.setLanguage(language);
            tesseract.setPageSegMode(1);
            tesseract.setOcrEngineMode(1);
            return tesseract.doOCR(image);
        } catch (Exception e) {
            log.error("Tesseract OCR failed: {}", e.getMessage());
            return "OCR processing unavailable. Please ensure Tesseract is installed.";
        }
    }
}
