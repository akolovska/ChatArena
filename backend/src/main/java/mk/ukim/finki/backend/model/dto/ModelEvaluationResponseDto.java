package mk.ukim.finki.backend.model.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ModelEvaluationResponseDto(
        Long id,
        Long modelId,
        Map<String, Integer> scores,
        String comment,
        String evaluatorName,
        LocalDateTime createdAt
) {}
