CREATE TABLE users (
                       id          BIGSERIAL PRIMARY KEY,
                       name        VARCHAR(255) NOT NULL,
                       surname     VARCHAR(255) NOT NULL,
                       email       VARCHAR(255) NOT NULL,
                       username    VARCHAR(255),
                       password    VARCHAR(255),
                       role        VARCHAR(50)  NOT NULL,

                       created_at  TIMESTAMP NOT NULL,
                       updated_at  TIMESTAMP NOT NULL,

                       CONSTRAINT uq_users_email    UNIQUE (email),
                       CONSTRAINT uq_users_username UNIQUE (username)
);

CREATE TABLE questions (
                           id          BIGSERIAL PRIMARY KEY,
                           text        TEXT         NOT NULL,
                           category    VARCHAR(50)  NOT NULL,
                           difficulty  VARCHAR(50)  NOT NULL,

                           created_at  TIMESTAMP NOT NULL,
                           updated_at  TIMESTAMP NOT NULL,

                           CONSTRAINT chk_questions_category
                               CHECK (category IN ('GENERAL', 'SCIENCE', 'HISTORY', 'CULTURE')),
                           CONSTRAINT chk_questions_difficulty
                               CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

CREATE TABLE llm_models (
                            id            BIGSERIAL PRIMARY KEY,
                            display_name  VARCHAR(255) NOT NULL,
                            active        BOOLEAN      NOT NULL DEFAULT true,
                            provider_type VARCHAR(100),
                            config_json   TEXT,

                            created_at    TIMESTAMP NOT NULL,
                            updated_at    TIMESTAMP NOT NULL
);

CREATE TABLE evaluations (
                             id              BIGSERIAL PRIMARY KEY,
                             question_id     BIGINT       NOT NULL,
                             model_id        BIGINT       NOT NULL,
                             comment         TEXT,
                             evaluator_name  VARCHAR(255),

                             created_at      TIMESTAMP NOT NULL,
                             updated_at      TIMESTAMP NOT NULL,

                             CONSTRAINT fk_evaluations_question
                                 FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
                             CONSTRAINT fk_evaluations_model
                                 FOREIGN KEY (model_id) REFERENCES llm_models (id) ON DELETE CASCADE
);

CREATE INDEX idx_evaluations_question_id ON evaluations (question_id);
CREATE INDEX idx_evaluations_model_id    ON evaluations (model_id);