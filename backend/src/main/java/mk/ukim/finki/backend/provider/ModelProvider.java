package mk.ukim.finki.backend.provider;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;

public interface ModelProvider {
    String getAnswer(LlmModel model, Question question);
}