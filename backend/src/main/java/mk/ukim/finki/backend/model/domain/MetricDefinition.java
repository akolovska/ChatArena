package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "metric_definitions")
public class MetricDefinition {
    @Id
    @Column(name = "metric_key")
    private String metricKey;

    private String displayNameMk;
    private String displayNameEn;
    private Integer sortOrder;
    private boolean active = true;
}