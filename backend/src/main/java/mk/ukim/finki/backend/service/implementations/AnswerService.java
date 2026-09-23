package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.dto.AskResponseDto;
import mk.ukim.finki.backend.model.exceptions.InactiveModelException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.model.exceptions.QuestionNotFoundException;
import mk.ukim.finki.backend.model.exceptions.ResourceNotFoundException;
import mk.ukim.finki.backend.provider.ModelProvider;
import mk.ukim.finki.backend.provider.ModelProviderRegistry;
import mk.ukim.finki.backend.provider.StaticJsonModelProvider;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.repository.QuestionRepository;
import mk.ukim.finki.backend.service.IAnswerService;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {

    private final QuestionRepository questionRepository;
    private final LlmModelRepository llmModelRepository;
    private final ModelProviderRegistry providerRegistry;

    public AnswerService(QuestionRepository questionRepository,
                         LlmModelRepository llmModelRepository,
                         ModelProviderRegistry providerRegistry) {
        this.questionRepository = questionRepository;
        this.llmModelRepository = llmModelRepository;
        this.providerRegistry = providerRegistry;
    }

    public AskResponseDto getAnswer(Long questionId, Long modelId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));
        LlmModel model = llmModelRepository.findById(modelId)
                .orElseThrow(() -> new LlmModelNotFoundException(modelId));

        if (!model.isActive()) {
            throw new InactiveModelException(modelId);
        }

        ModelProvider provider = providerRegistry.get(model.getProviderType());
        String answer = provider.getAnswer(model, question);

        return new AskResponseDto(model.getId(), model.getDisplayName(), answer);
    }
}