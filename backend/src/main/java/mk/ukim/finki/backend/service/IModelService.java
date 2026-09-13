package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.dto.LlmModelDto;

import java.util.List;

public interface IModelService {
    List<LlmModelDto> findAll();
    LlmModelDto create(LlmModelDto dto);
    LlmModelDto update(Long id, LlmModelDto dto);
    LlmModel getEntityOrThrow(Long id);
}