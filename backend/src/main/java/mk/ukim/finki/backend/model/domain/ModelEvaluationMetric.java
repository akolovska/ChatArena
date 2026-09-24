package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "model_evaluation_metrics")
public class ModelEvaluationMetric extends BaseEntity{

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_evaluation_id")
    private ModelEvaluation modelEvaluation;

    @Column(name = "metric_key", nullable = false)
    private String metricKey;

    @Column(nullable = false)
    private Integer value;
}