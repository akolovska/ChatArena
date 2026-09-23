package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.*;
import mk.ukim.finki.backend.model.dto.EvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.EvaluationResponseDto;
import mk.ukim.finki.backend.model.dto.MetricDefinitionDto;
import mk.ukim.finki.backend.model.dto.ScoresDto;
import mk.ukim.finki.backend.model.exceptions.EvaluationNotFoundException;
import mk.ukim.finki.backend.model.exceptions.InvalidScoreException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.model.exceptions.QuestionNotFoundException;
import mk.ukim.finki.backend.repository.*;
import mk.ukim.finki.backend.service.IEvaluationService;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EvaluationService implements IEvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final QuestionRepository questionRepository;
    private final LlmModelRepository llmModelRepository;
    private final EvaluationMetricRepository evaluationMetricRepository;
    private final MetricDefinitionRepository metricDefinitionRepository;

    public EvaluationService(EvaluationRepository evaluationRepository,
                             QuestionRepository questionRepository,
                             LlmModelRepository llmModelRepository, EvaluationMetricRepository evaluationMetricRepository, MetricDefinitionRepository metricDefinitionRepository) {
        this.evaluationRepository = evaluationRepository;
        this.questionRepository = questionRepository;
        this.llmModelRepository = llmModelRepository;
        this.evaluationMetricRepository = evaluationMetricRepository;
        this.metricDefinitionRepository = metricDefinitionRepository;
    }

    @Override
    @Transactional
    public EvaluationResponseDto create(EvaluationRequestDto request, String evaluatorUsername) throws BadRequestException {
        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new QuestionNotFoundException(request.questionId()));
        LlmModel model = llmModelRepository.findById(request.modelId())
                .orElseThrow(() -> new LlmModelNotFoundException(request.modelId()));

        Set<String> validKeys = metricDefinitionRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream().map(MetricDefinition::getMetricKey).collect(Collectors.toSet());

        validateScores(request.scores(), validKeys);

        Evaluation evaluation = new Evaluation();
        evaluation.setQuestion(question);
        evaluation.setModel(model);
        evaluation.setComment(request.comment());
        evaluation.setEvaluatorName(evaluatorUsername);
        evaluationRepository.save(evaluation);

        attachMetrics(evaluation, request.scores());

        return toDto(evaluation);
    }

    @Override
    @Transactional
    public EvaluationResponseDto update(Long id, EvaluationRequestDto request) throws BadRequestException {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new EvaluationNotFoundException(id));

        Set<String> validKeys = metricDefinitionRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream().map(MetricDefinition::getMetricKey).collect(Collectors.toSet());
        validateScores(request.scores(), validKeys);

        evaluation.setComment(request.comment());
        evaluation.getMetrics().clear(); // orphanRemoval handles the delete
        evaluationRepository.save(evaluation);

        attachMetrics(evaluation, request.scores());

        return toDto(evaluation);
    }

    private void attachMetrics(Evaluation evaluation, Map<String, Integer> scores) {
        List<EvaluationMetric> metrics = scores.entrySet().stream().map(e -> {
            EvaluationMetric m = new EvaluationMetric();
            m.setEvaluation(evaluation);
            m.setMetricKey(e.getKey());
            m.setValue(e.getValue());
            return m;
        }).toList();
        evaluation.getMetrics().addAll(metrics);
        evaluationRepository.save(evaluation);
    }

    private void validateScores(Map<String, Integer> scores, Set<String> validKeys) throws BadRequestException {
        if (scores == null || scores.isEmpty()) {
            throw new BadRequestException("Scores are required");
        }
        for (var entry : scores.entrySet()) {
            if (!validKeys.contains(entry.getKey())) {
                throw new BadRequestException("Unknown metric: " + entry.getKey());
            }
            int v = entry.getValue();
            if (v < 1 || v > 5) {
                throw new InvalidScoreException(entry.getKey());
            }
        }
    }

    @Override
    public EvaluationResponseDto findById(Long id) {
        return toDto(evaluationRepository.findById(id)
                .orElseThrow(() -> new EvaluationNotFoundException(id)));
    }

    @Override
    public List<EvaluationResponseDto> findAll(Long questionId) {
        List<Evaluation> evaluations = questionId != null
                ? evaluationRepository.findByQuestionId(questionId)
                : evaluationRepository.findAll();
        return evaluations.stream().map(this::toDto).toList();
    }

    public List<MetricDefinitionDto> getActiveMetrics() {
        return metricDefinitionRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(m -> new MetricDefinitionDto(m.getMetricKey(), m.getDisplayNameMk(), m.getSortOrder()))
                // NOTE: swap displayNameMk/displayNameEn based on locale if you want server-side i18n;
                // simpler to send both and let the frontend pick — see note below.
                .toList();
    }

    private EvaluationResponseDto toDto(Evaluation e) {
        Map<String, Integer> scores = e.getMetrics().stream()
                .collect(Collectors.toMap(EvaluationMetric::getMetricKey, EvaluationMetric::getValue));
        return new EvaluationResponseDto(
                e.getId(), e.getQuestion().getId(), e.getModel().getId(),
                scores, e.getComment(), e.getEvaluatorName(),
                e.getModel().getDisplayName(), e.getCreatedAt()
        );
    }
}