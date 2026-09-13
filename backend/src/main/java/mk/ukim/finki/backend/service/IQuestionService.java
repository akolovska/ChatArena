package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.dto.QuestionDto;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;

import java.util.List;

public interface IQuestionService {
    List<QuestionDto> findAll(QuestionCategory category, QuestionDifficulty difficulty);
    QuestionDto findRandom();
}