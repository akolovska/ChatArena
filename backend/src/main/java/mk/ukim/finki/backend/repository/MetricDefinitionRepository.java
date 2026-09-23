package mk.ukim.finki.backend.repository;

import mk.ukim.finki.backend.model.domain.MetricDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetricDefinitionRepository extends JpaRepository<MetricDefinition, String> {
    List<MetricDefinition> findByActiveTrueOrderBySortOrderAsc();
}