package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "model_evaluations")
public class ModelEvaluation extends BaseAuditableEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private LlmModel model;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private String evaluatorName;

    @OneToMany(mappedBy = "modelEvaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModelEvaluationMetric> metrics = new ArrayList<>();
}