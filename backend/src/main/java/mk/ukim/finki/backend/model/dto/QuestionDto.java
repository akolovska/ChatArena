package mk.ukim.finki.backend.model.dto;

import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;

public record QuestionDto(Long id, String text, QuestionCategory category, QuestionDifficulty difficulty) {}

