package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;
import mk.ukim.finki.backend.service.IEvaluationService;
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
    public EvaluationResponseDto create(Authentication auth, @RequestBody EvaluationRequestDto req) {
        return evaluationService.create(req, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'ADMIN')")
    public EvaluationResponseDto update(@PathVariable Long id, @RequestBody EvaluationRequestDto req) {
        return evaluationService.update(id, req);
    }

    @GetMapping("/{id}")
    public EvaluationResponseDto findById(@PathVariable Long id) {
        return evaluationService.findById(id);
    }

    @GetMapping
    public List<EvaluationResponseDto> findAll(@RequestParam(required = false) Long questionId) {
        return evaluationService.findAll(questionId);
    }
}
