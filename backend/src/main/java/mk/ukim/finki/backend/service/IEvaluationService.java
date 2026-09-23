package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;
import mk.ukim.finki.backend.model.dto.MetricDefinitionDto;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface IEvaluationService {
    EvaluationResponseDto create(EvaluationRequestDto request, String evaluatorUsername) throws BadRequestException;
    EvaluationResponseDto update(Long id, EvaluationRequestDto request) throws BadRequestException;
    EvaluationResponseDto findById(Long id);
    List<EvaluationResponseDto> findAll(Long questionId);
    List<MetricDefinitionDto> getActiveMetrics();
}
