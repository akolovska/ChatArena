package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.ModelEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModelEvaluationRepository extends JpaRepository<ModelEvaluation, Long> {
    List<ModelEvaluation> findByModelId(Long modelId);
}