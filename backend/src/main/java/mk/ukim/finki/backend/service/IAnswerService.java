package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.dto.AskResponseDto;

public interface IAnswerService {
    AskResponseDto getAnswer(Long questionId, Long modelId);
}
