package mk.ukim.finki.backend.model.dto;

import java.time.LocalDateTime;

public record EvaluationResponseDto(
        Long id, Long questionId, Long modelId, ScoresDto scores,
        String comment, String evaluatorName, String modelDisplayName, LocalDateTime createdAt
) {}
