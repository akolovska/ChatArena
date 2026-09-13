package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;

import java.util.List;

public interface IEvaluationService {
    EvaluationResponseDto create(EvaluationRequestDto request, String evaluatorUsername);
    EvaluationResponseDto update(Long id, EvaluationRequestDto request);
    EvaluationResponseDto findById(Long id);
    List<EvaluationResponseDto> findAll(Long questionId);
}
