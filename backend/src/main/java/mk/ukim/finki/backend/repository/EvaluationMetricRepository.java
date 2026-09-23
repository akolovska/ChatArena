package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.EvaluationMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EvaluationMetricRepository extends JpaRepository<EvaluationMetric, Long> {

    List<EvaluationMetric> findByEvaluationId(Long evaluationId);

    @Query(value = """
        SELECT e.model_id AS "modelId", em.metric_key AS "metricKey", AVG(em.value) AS "avgValue"
        FROM evaluation_metrics em
        JOIN evaluations e ON e.id = em.evaluation_id
        GROUP BY e.model_id, em.metric_key
        """, nativeQuery = true)
    List<MetricAverageProjection> findMetricAverages();

    interface MetricAverageProjection {
        Long getModelId();
        String getMetricKey();
        Double getAvgValue();
    }
}