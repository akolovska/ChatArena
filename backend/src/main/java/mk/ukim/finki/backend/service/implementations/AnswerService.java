package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.dto.AskResponseDto;
import mk.ukim.finki.backend.model.exceptions.InactiveModelException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.model.exceptions.QuestionNotFoundException;
import mk.ukim.finki.backend.model.exceptions.ResourceNotFoundException;
import mk.ukim.finki.backend.provider.StaticJsonModelProvider;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.repository.QuestionRepository;
import mk.ukim.finki.backend.service.IAnswerService;
import org.springframework.stereotype.Service;

@Service
public class AnswerService implements IAnswerService {

    private final QuestionRepository questionRepository;
    private final LlmModelRepository modelRepository;
    private final StaticJsonModelProvider staticProvider;

    public AnswerService(QuestionRepository questionRepository, LlmModelRepository modelRepository, StaticJsonModelProvider staticProvider) {
        this.questionRepository = questionRepository;
        this.modelRepository = modelRepository;
        this.staticProvider = staticProvider;
    }

    @Override
    public AskResponseDto getAnswer(Long questionId, Long modelId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));
        LlmModel model = modelRepository.findById(modelId)
                .orElseThrow(() -> new LlmModelNotFoundException(modelId));

        if (!model.isActive()) {
            throw new InactiveModelException(modelId);
        }

        String answer = staticProvider.getAnswer(model, question);

        return new AskResponseDto(model.getId(), model.getDisplayName(), answer);
    }
}