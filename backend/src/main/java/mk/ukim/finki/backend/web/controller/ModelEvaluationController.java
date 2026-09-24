package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.ModelEvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.ModelEvaluationResponseDto;
import mk.ukim.finki.backend.service.implementations.ModelEvaluationService;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/models")
public class ModelEvaluationController {

    private final ModelEvaluationService modelEvaluationService;

    public ModelEvaluationController(ModelEvaluationService modelEvaluationService) {
        this.modelEvaluationService = modelEvaluationService;
    }

    @GetMapping("/{modelId}/evaluations")
    public ResponseEntity<List<ModelEvaluationResponseDto>> findByModel(@PathVariable Long modelId) {
        return ResponseEntity.ok(modelEvaluationService.findByModel(modelId));
    }

    @PostMapping("/{modelId}/evaluations")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'ADMIN')")
    public ResponseEntity<ModelEvaluationResponseDto> create(@PathVariable Long modelId, Authentication auth,
                                             @RequestBody ModelEvaluationRequestDto request) throws BadRequestException {
        return ResponseEntity.ok(modelEvaluationService.create(modelId, request, auth.getName()));
    }

    @PutMapping("/evaluations/{id}")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'ADMIN')")
    public ResponseEntity<ModelEvaluationResponseDto> update(@PathVariable Long id, @RequestBody ModelEvaluationRequestDto request) throws BadRequestException {
        return ResponseEntity.ok(modelEvaluationService.update(id, request));
    }
}