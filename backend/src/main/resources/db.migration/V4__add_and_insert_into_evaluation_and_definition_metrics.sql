CREATE TABLE metric_definitions (
    metric_key       VARCHAR(50) PRIMARY KEY,
    display_name_mk  VARCHAR(100) NOT NULL,
    display_name_en  VARCHAR(100) NOT NULL,
    sort_order       INTEGER NOT NULL,
    active           BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO metric_definitions (metric_key, display_name_mk, display_name_en, sort_order, active) VALUES
    ('fluency', 'Течност', 'Fluency', 1, true),
    ('accuracy', 'Точност', 'Accuracy', 2, true),
    ('relevance', 'Релевантност', 'Relevance', 3, true),
    ('grammar', 'Граматика', 'Grammar', 4, true),
    ('coherence', 'Кохерентност', 'Coherence', 5, true),
    ('completeness', 'Целосност', 'Completeness', 6, true),
    ('conciseness', 'Концизност', 'Conciseness', 7, true),
    ('instruction_following', 'Следење инструкции', 'Instruction Following', 8, true),
    ('cultural_appropriateness', 'Културна соодветност', 'Cultural Appropriateness', 9, true),
    ('safety', 'Безбедност', 'Safety', 10, true),
    ('groundedness', 'Фактичка поткрепеност', 'Groundedness', 11, true),
    ('helpfulness', 'Корисност', 'Helpfulness', 12, true),
    ('register', 'Природност на регистарот', 'Register Naturalness', 13, true);

CREATE TABLE evaluation_metrics (
    id             BIGSERIAL PRIMARY KEY,
    evaluation_id  BIGINT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    metric_key     VARCHAR(50) NOT NULL REFERENCES metric_definitions(metric_key),
    value          INTEGER NOT NULL CHECK (value BETWEEN 1 AND 5),
    UNIQUE (evaluation_id, metric_key)
);

CREATE INDEX idx_evaluation_metrics_evaluation_id ON evaluation_metrics(evaluation_id);
CREATE INDEX idx_evaluation_metrics_metric_key ON evaluation_metrics(metric_key);
CREATE INDEX idx_evaluations_model_id ON evaluations(model_id);

ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS chk_evaluations_fluency;
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS chk_evaluations_accuracy;
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS chk_evaluations_relevance;
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS chk_evaluations_grammar;
ALTER TABLE evaluations DROP COLUMN IF EXISTS fluency;
ALTER TABLE evaluations DROP COLUMN IF EXISTS accuracy;
ALTER TABLE evaluations DROP COLUMN IF EXISTS relevance;
ALTER TABLE evaluations DROP COLUMN IF EXISTS grammar;