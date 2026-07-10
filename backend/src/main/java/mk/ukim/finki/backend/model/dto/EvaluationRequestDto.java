package mk.ukim.finki.backend.model.dto;

public record EvaluationRequestDto(
        Long questionId, Long modelId, ScoresDto scores, String comment, String evaluatorName
) {}