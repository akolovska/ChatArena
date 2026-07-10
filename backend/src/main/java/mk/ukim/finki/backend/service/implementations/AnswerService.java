package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.dto.AskResponseDto;
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
    // later: ModelProviderRegistry that picks provider by model.getProviderType()

    public AskResponseDto getAnswer(Long questionId, Long modelId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        LlmModel model = modelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Model not found"));

        long start = System.currentTimeMillis();
        String answer = staticProvider.getAnswer(modelId, question); // swap by providerType later
        long elapsed = System.currentTimeMillis() - start;

        return new AskResponseDto(model.getId(), model.getDisplayName(), answer, elapsed);
    }
}