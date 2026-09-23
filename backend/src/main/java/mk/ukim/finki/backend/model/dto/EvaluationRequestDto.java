package mk.ukim.finki.backend.model.dto;

import java.util.Map;

public record EvaluationRequestDto(
        Long questionId,
        Long modelId,
        Map<String, Integer> scores,
        String comment,
        String evaluatorName
) {}