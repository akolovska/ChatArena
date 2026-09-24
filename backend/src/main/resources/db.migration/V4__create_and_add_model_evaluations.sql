ALTER TABLE metric_definitions
    ADD COLUMN scope VARCHAR(20) NOT NULL DEFAULT 'RESPONSE';
ALTER TABLE metric_definitions
    ADD CONSTRAINT chk_metric_scope CHECK (scope IN ('RESPONSE', 'MODEL'));

INSERT INTO metric_definitions (metric_key, display_name_mk, display_name_en, sort_order, active, scope)
VALUES ('robustness', 'Робусност', 'Robustness', 14, true, 'MODEL'),
       ('consistency', 'Конзистентност', 'Consistency', 15, true, 'MODEL'),
       ('model_safety', 'Севкупна безбедност', 'Overall Safety', 16, true, 'MODEL'),
       ('fairness', 'Правичност / пристрасност', 'Fairness & Bias', 17, true, 'MODEL'),
       ('hallucination_tendency', 'Тенденција кон измислување', 'Hallucination Tendency', 18, true, 'MODEL'),
       ('generalization', 'Генерализација', 'Generalization', 19, true, 'MODEL'),
       ('explainability', 'Објаснивост', 'Explainability', 20, true, 'MODEL'),
       ('instruction_adherence', 'Следење инструкции низ времето', 'Instruction Adherence', 21, true, 'MODEL'),
       ('trustworthiness', 'Доверливост', 'Trustworthiness', 22, true, 'MODEL'),
       ('overall_value', 'Севкупна корисност', 'Overall Value', 23, true, 'MODEL');

CREATE TABLE model_evaluations
(
    id             BIGSERIAL PRIMARY KEY,
    model_id       BIGINT    NOT NULL REFERENCES llm_models (id) ON DELETE CASCADE,
    evaluator_name VARCHAR(255),
    comment        TEXT,
    created_at     TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP NOT NULL
);

CREATE TABLE model_evaluation_metrics
(
    id                  BIGSERIAL PRIMARY KEY,
    model_evaluation_id BIGINT      NOT NULL REFERENCES model_evaluations (id) ON DELETE CASCADE,
    metric_key          VARCHAR(50) NOT NULL REFERENCES metric_definitions (metric_key),
    value               INTEGER     NOT NULL CHECK (value BETWEEN 1 AND 5),
    UNIQUE (model_evaluation_id, metric_key)
);

CREATE INDEX idx_model_evaluations_model_id ON model_evaluations (model_id);
CREATE INDEX idx_model_evaluation_metrics_eval_id ON model_evaluation_metrics (model_evaluation_id);