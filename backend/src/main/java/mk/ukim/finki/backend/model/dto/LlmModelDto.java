package mk.ukim.finki.backend.model.dto;

import java.util.Map;

public record LlmModelDto(Long id, String displayName, boolean active, String providerType, Map<String, Object> config) {

}

