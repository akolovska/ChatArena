package mk.ukim.finki.backend.service.implementations;

import jakarta.transaction.Transactional;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.MetricDefinition;
import mk.ukim.finki.backend.model.domain.ModelEvaluation;
import mk.ukim.finki.backend.model.domain.ModelEvaluationMetric;
import mk.ukim.finki.backend.model.dto.ModelEvaluationRequestDto;
import mk.ukim.finki.backend.model.dto.ModelEvaluationResponseDto;
import mk.ukim.finki.backend.model.exceptions.InvalidScoreException;
import mk.ukim.finki.backend.model.exceptions.LlmModelNotFoundException;
import mk.ukim.finki.backend.model.exceptions.ModelEvaluationNotFoundException;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.repository.MetricDefinitionRepository;
import mk.ukim.finki.backend.repository.ModelEvaluationRepository;
import mk.ukim.finki.backend.service.IModelEvaluationService;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ModelEvaluationService implements IModelEvaluationService {

    private final ModelEvaluationRepository modelEvaluationRepository;
    private final LlmModelRepository llmModelRepository;
    private final MetricDefinitionRepository metricDefinitionRepository;

    public ModelEvaluationService(ModelEvaluationRepository modelEvaluationRepository,
                                  LlmModelRepository llmModelRepository,
                                  MetricDefinitionRepository metricDefinitionRepository) {
        this.modelEvaluationRepository = modelEvaluationRepository;
        this.llmModelRepository = llmModelRepository;
        this.metricDefinitionRepository = metricDefinitionRepository;
    }

    @Transactional
    @Override
    public ModelEvaluationResponseDto create(Long modelId, ModelEvaluationRequestDto request, String evaluatorUsername) throws BadRequestException {
        LlmModel model = llmModelRepository.findById(modelId)
                .orElseThrow(() -> new LlmModelNotFoundException(modelId));

        validateScores(request.scores());

        ModelEvaluation evaluation = new ModelEvaluation();
        evaluation.setModel(model);
        evaluation.setComment(request.comment());
        evaluation.setEvaluatorName(evaluatorUsername);
        modelEvaluationRepository.save(evaluation);

        attachMetrics(evaluation, request.scores());
        return toDto(evaluation);
    }

    @Transactional
    @Override
    public ModelEvaluationResponseDto update(Long id, ModelEvaluationRequestDto request) throws BadRequestException {
        ModelEvaluation evaluation = modelEvaluationRepository.findById(id)
                .orElseThrow(() -> new ModelEvaluationNotFoundException(id));

        validateScores(request.scores());

        evaluation.setComment(request.comment());
        evaluation.getMetrics().clear();
        modelEvaluationRepository.saveAndFlush(evaluation); // force the delete to hit the DB now

        attachMetrics(evaluation, request.scores());
        return toDto(evaluation);
    }

    @Override
    public List<ModelEvaluationResponseDto> findByModel(Long modelId) {
        return modelEvaluationRepository.findByModelId(modelId).stream()
                .map(this::toDto)
                .toList();
    }

    private void attachMetrics(ModelEvaluation evaluation, Map<String, Integer> scores) {
        List<ModelEvaluationMetric> metrics = scores.entrySet().stream().map(e -> {
            ModelEvaluationMetric m = new ModelEvaluationMetric();
            m.setModelEvaluation(evaluation);
            m.setMetricKey(e.getKey());
            m.setValue(e.getValue());
            return m;
        }).toList();
        evaluation.getMetrics().addAll(metrics);
        modelEvaluationRepository.save(evaluation);
    }

    private void validateScores(Map<String, Integer> scores) throws BadRequestException {
        Set<String> validKeys = metricDefinitionRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .filter(m -> "MODEL".equals(m.getScope()))
                .map(MetricDefinition::getMetricKey)
                .collect(Collectors.toSet());

        if (scores == null || scores.isEmpty()) {
            throw new BadRequestException("Scores are required");
        }
        for (var entry : scores.entrySet()) {
            if (!validKeys.contains(entry.getKey())) {
                throw new BadRequestException("Unknown model-level metric: " + entry.getKey());
            }
            if (entry.getValue() < 1 || entry.getValue() > 5) {
                throw new InvalidScoreException(entry.getKey());
            }
        }
    }

    private ModelEvaluationResponseDto toDto(ModelEvaluation e) {
        Map<String, Integer> rawScores = e.getMetrics().stream()
                .collect(Collectors.toMap(ModelEvaluationMetric::getMetricKey, ModelEvaluationMetric::getValue));

        Map<String, Integer> orderedScores = new LinkedHashMap<>();
        metricDefinitionRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .filter(m -> "MODEL".equals(m.getScope()) && rawScores.containsKey(m.getMetricKey()))
                .forEach(m -> orderedScores.put(m.getMetricKey(), rawScores.get(m.getMetricKey())));

        return new ModelEvaluationResponseDto(
                e.getId(), e.getModel().getId(), orderedScores, e.getComment(), e.getEvaluatorName(), e.getCreatedAt()
        );
    }
}