package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "questions")
public class Question extends BaseAuditableEntity {
    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private QuestionCategory category;   // general, science, history, culture

    @Column(nullable = false)
    private QuestionDifficulty difficulty; // easy, medium, hard

}