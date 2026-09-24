package mk.ukim.finki.backend.model.dto;

public record MetricDefinitionDto(String key, String displayNameMk, String displayNameEn, int sortOrder, String scope) {}