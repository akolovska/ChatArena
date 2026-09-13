package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByQuestionId(Long questionId);
}
