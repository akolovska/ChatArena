package mk.ukim.finki.backend.model.dto;

import java.util.Map;

public record LeaderboardEntryDto(
        Long modelId,
        String modelDisplayName,
        Map<String, Double> averageByMetric,
        double overallAverage,
        long evaluationCount
) {}