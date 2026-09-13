package mk.ukim.finki.backend.service.implementations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.dto.LlmModelDto;
import mk.ukim.finki.backend.model.exceptions.InvalidModelConfigException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.service.IModelService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class ModelService implements IModelService {

    private final LlmModelRepository llmModelRepository;
    private final ObjectMapper objectMapper;

    public ModelService(LlmModelRepository llmModelRepository, ObjectMapper objectMapper) {
        this.llmModelRepository = llmModelRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public LlmModel getEntityOrThrow(Long id) {
        return llmModelRepository.findById(id)
                .orElseThrow(() -> new LlmModelNotFoundException(id));
    }

    @Override
    public java.util.List<LlmModelDto> findAll() {
        return llmModelRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public LlmModelDto create(LlmModelDto dto) {
        LlmModel model = new LlmModel();
        model.setDisplayName(dto.displayName());
        model.setProviderType(dto.providerType());
        model.setActive(dto.active());
        model.setConfigJson(writeConfig(dto.config()));

        llmModelRepository.save(model);
        return toDto(model);
    }

    @Override
    @Transactional
    public LlmModelDto update(Long id, LlmModelDto dto) {
        LlmModel model = llmModelRepository.findById(id)
                .orElseThrow(() -> new LlmModelNotFoundException(id));

        if (dto.displayName() != null) {
            model.setDisplayName(dto.displayName());
        }
        if (dto.providerType() != null) {
            model.setProviderType(dto.providerType());
        }
        model.setActive(dto.active());
        if (dto.config() != null) {
            model.setConfigJson(writeConfig(dto.config()));
        }

        llmModelRepository.save(model);
        return toDto(model);
    }

    private LlmModelDto toDto(LlmModel model) {
        return new LlmModelDto(
                model.getId(),
                model.getDisplayName(),
                model.isActive(),
                model.getProviderType(),
                readConfig(model.getConfigJson())
        );
    }

    private String writeConfig(Map<String, Object> config) {
        try {
            return objectMapper.writeValueAsString(config == null ? Map.of() : config);
        } catch (JsonProcessingException e) {
            throw new InvalidModelConfigException();
        }
    }

    private Map<String, Object> readConfig(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }
}