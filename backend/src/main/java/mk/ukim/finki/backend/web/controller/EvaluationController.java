package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;
import mk.ukim.finki.backend.model.dto.MetricDefinitionDto;
import mk.ukim.finki.backend.service.IEvaluationService;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    private final IEvaluationService evaluationService;

    public EvaluationController(IEvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EVALUATOR', 'ADMIN')")
    public ResponseEntity<EvaluationResponseDto> create(Authentication auth, @RequestBody EvaluationRequestDto req) throws BadRequestException {
        return ResponseEntity.ok(evaluationService.create(req, auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'ADMIN')")
    public ResponseEntity<EvaluationResponseDto> update(@PathVariable Long id, @RequestBody EvaluationRequestDto req) throws BadRequestException {
        return ResponseEntity.ok(evaluationService.update(id, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<EvaluationResponseDto>> findAll(@RequestParam(required = false) Long questionId) {
        return ResponseEntity.ok(evaluationService.findAll(questionId));
    }
    @GetMapping("/evaluations/metrics")
    public List<MetricDefinitionDto> getMetrics() {
        return evaluationService.getActiveMetrics();
    }
}
