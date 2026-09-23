package mk.ukim.finki.backend.model.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record EvaluationResponseDto(
        Long id,
        Long questionId,
        Long modelId,
        Map<String, Integer> scores,
        String comment,
        String evaluatorName,
        String modelDisplayName,
        LocalDateTime createdAt
) {}
