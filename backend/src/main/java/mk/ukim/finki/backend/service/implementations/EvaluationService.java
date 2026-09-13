package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.Evaluation;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;
import mk.ukim.finki.backend.model.dto.ScoresDto;
import mk.ukim.finki.backend.model.exceptions.EvaluationNotFoundException;
import mk.ukim.finki.backend.model.exceptions.InvalidScoreException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.model.exceptions.QuestionNotFoundException;
import mk.ukim.finki.backend.repository.EvaluationRepository;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.repository.QuestionRepository;
import mk.ukim.finki.backend.service.IEvaluationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvaluationService implements IEvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final QuestionRepository questionRepository;
    private final LlmModelRepository llmModelRepository;

    public EvaluationService(EvaluationRepository evaluationRepository,
                             QuestionRepository questionRepository,
                             LlmModelRepository llmModelRepository) {
        this.evaluationRepository = evaluationRepository;
        this.questionRepository = questionRepository;
        this.llmModelRepository = llmModelRepository;
    }

    @Override
    @Transactional
    public EvaluationResponseDto create(EvaluationRequestDto request, String evaluatorUsername) {
        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new QuestionNotFoundException(request.questionId()));
        LlmModel model = llmModelRepository.findById(request.modelId())
                .orElseThrow(() -> new LlmModelNotFoundException(request.modelId()));

        Evaluation evaluation = new Evaluation();
        evaluation.setQuestion(question);
        evaluation.setModel(model);
        applyScores(evaluation, request.scores());
        evaluation.setComment(request.comment());
        evaluation.setEvaluatorName(evaluatorUsername);

        evaluationRepository.save(evaluation);
        return toDto(evaluation);
    }

    @Override
    @Transactional
    public EvaluationResponseDto update(Long id, EvaluationRequestDto request) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new EvaluationNotFoundException(id));

        applyScores(evaluation, request.scores());
        evaluation.setComment(request.comment());

        evaluationRepository.save(evaluation);
        return toDto(evaluation);
    }

    @Override
    public EvaluationResponseDto findById(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new EvaluationNotFoundException(id));
        return toDto(evaluation);
    }

    @Override
    public List<EvaluationResponseDto> findAll(Long questionId) {
        List<Evaluation> evaluations = questionId != null
                ? evaluationRepository.findByQuestionId(questionId)
                : evaluationRepository.findAll();

        return evaluations.stream().map(this::toDto).toList();
    }

    private void applyScores(Evaluation evaluation, ScoresDto scores) {
        validateScore(scores.fluency(), "fluency");
        validateScore(scores.accuracy(), "accuracy");
        validateScore(scores.relevance(), "relevance");
        validateScore(scores.grammar(), "grammar");

        evaluation.setFluency(scores.fluency());
        evaluation.setAccuracy(scores.accuracy());
        evaluation.setRelevance(scores.relevance());
        evaluation.setGrammar(scores.grammar());
    }

    private void validateScore(int score, String field) {
        if (score < 1 || score > 5) {
            throw new InvalidScoreException(field);
        }
    }

    private EvaluationResponseDto toDto(Evaluation e) {
        return new EvaluationResponseDto(
                e.getId(),
                e.getQuestion().getId(),
                e.getModel().getId(),
                new ScoresDto(e.getFluency(), e.getAccuracy(), e.getRelevance(), e.getGrammar()),
                e.getComment(),
                e.getEvaluatorName(),
                e.getModel().getDisplayName(),
                e.getCreatedAt()
        );
    }
}