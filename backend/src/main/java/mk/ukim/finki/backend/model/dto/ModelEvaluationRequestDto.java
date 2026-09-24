package mk.ukim.finki.backend.model.dto;

import java.util.Map;

public record ModelEvaluationRequestDto(
        Map<String, Integer> scores,
        String comment,
        String evaluatorName
) {}