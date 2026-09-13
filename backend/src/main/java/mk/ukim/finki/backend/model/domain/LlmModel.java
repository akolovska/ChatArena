package mk.ukim.finki.backend.model.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "llm_models")
public class LlmModel extends BaseAuditableEntity{
    @Column(nullable = false)
    private String displayName;

    private boolean active = true;

    private String providerType; // "static-json", "openai", "anthropic", "custom-http"

    @Column(columnDefinition = "TEXT")
    private String configJson;   // store config map as JSON string
}