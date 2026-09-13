package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "evaluations")
public class Evaluation extends BaseAuditableEntity{

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private LlmModel model;

    private int fluency;
    private int accuracy;
    private int relevance;
    private int grammar;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private String evaluatorName;

}