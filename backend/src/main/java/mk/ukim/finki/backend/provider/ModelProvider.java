package mk.ukim.finki.backend.provider;

import mk.ukim.finki.backend.model.domain.Question;

public interface ModelProvider {
    String getAnswer(Long questionId, Question question);
}