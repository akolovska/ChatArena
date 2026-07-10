package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByCategory(QuestionCategory category);
    List<Question> findByDifficulty(QuestionDifficulty difficulty);
    List<Question> findByCategoryAndDifficulty(QuestionCategory category, QuestionDifficulty difficulty);

    @Query(value = "SELECT * FROM questions ORDER BY random() LIMIT 1", nativeQuery = true)
    Question findRandomQuestion();
}
