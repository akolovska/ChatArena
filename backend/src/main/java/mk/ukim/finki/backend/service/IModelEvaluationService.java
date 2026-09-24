package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.domain.ModelEvaluation;
import mk.ukim.finki.backend.model.dto.ModelEvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.ModelEvaluationResponseDto;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Map;

public interface IModelEvaluationService {
    ModelEvaluationResponseDto create(Long modelId, ModelEvaluationRequestDto request, String evaluatorUsername) throws BadRequestException;
    ModelEvaluationResponseDto update(Long id, ModelEvaluationRequestDto request) throws BadRequestException;
    List<ModelEvaluationResponseDto> findByModel(Long modelId);
}
