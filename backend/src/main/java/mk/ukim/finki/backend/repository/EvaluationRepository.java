package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByQuestionId(Long questionId);
    @Query(value = "SELECT model_id AS \"modelId\", COUNT(*) AS \"cnt\" FROM evaluations GROUP BY model_id", nativeQuery = true)
    List<ModelEvaluationCountProjection> countByModel();

    interface ModelEvaluationCountProjection {
        Long getModelId();
        Long getCnt();
    }
}
