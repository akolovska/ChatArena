package mk.ukim.finki.backend.service.implementations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.dto.LlmModelDto;
import mk.ukim.finki.backend.model.exceptions.ResourceNotFoundException;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.service.IModelService;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ModelService {

    private final LlmModelRepository modelRepository;
    private final ObjectMapper objectMapper;

    public ModelService(LlmModelRepository modelRepository, ObjectMapper objectMapper) {
        this.modelRepository = modelRepository;
        this.objectMapper = objectMapper;
    }

    public List<LlmModelDto> findAll() {
        return modelRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public LlmModelDto create(LlmModelDto dto) throws BadRequestException {
        LlmModel model = new LlmModel();
        model.setDisplayName(dto.displayName());
        model.setProviderType(dto.providerType());
        model.setActive(dto.active());
        model.setConfigJson(writeConfig(dto.config()));

        modelRepository.save(model);
        return toDto(model);
    }

    @Transactional
    public LlmModelDto update(Long id, LlmModelDto dto) throws BadRequestException {
        LlmModel model = modelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Model not found: " + id));

        if (dto.displayName() != null) model.setDisplayName(dto.displayName());
        if (dto.providerType() != null) model.setProviderType(dto.providerType());
        model.setActive(dto.active());
        if (dto.config() != null) model.setConfigJson(writeConfig(dto.config()));

        modelRepository.save(model);
        return toDto(model);
    }

    // used internally by AnswerService
    public LlmModel getEntityOrThrow(Long id) {
        return modelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Model not found: " + id));
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

    private String writeConfig(Map<String, Object> config) throws BadRequestException {
        try {
            return objectMapper.writeValueAsString(config == null ? Map.of() : config);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Invalid model config");
        }
    }

    private Map<String, Object> readConfig(String json) {
        if (json == null || json.isBlank()) return Map.of();
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }
}
