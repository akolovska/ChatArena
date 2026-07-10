package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.LlmModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LlmModelRepository extends JpaRepository<LlmModel, Long> {
}
