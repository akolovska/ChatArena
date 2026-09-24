INSERT INTO users (name, surname, email, username, password, role, created_at, updated_at)
VALUES
    ('Dev', 'User',      'user@mkarena.dev',      'user',      '$2b$10$OxEN/pBSSDeQ96VZdMoEJebBKUrLevE16gr7d4jKybu7A1XsuUS3C', 'ROLE_USER',      now(), now()),
    ('Dev', 'Evaluator',  'evaluator@mkarena.dev', 'evaluator', '$2b$10$j6V6NG/sojSdnBaz6noGzeO4TGKkAFwOwLAKEdM2f5ahV0DhuukUe', 'ROLE_EVALUATOR', now(), now()),
    ('Dev', 'Admin',      'admin@mkarena.dev',     'admin',     '$2b$10$FOPOzvRAk38k5MR.diSmU.P0XXIDrPTKhN8jpiF5fsbGCKKZGMLw.', 'ROLE_ADMIN',     now(), now());

INSERT INTO questions (text, category, difficulty, created_at, updated_at)
VALUES
    ('Кои се падежите во македонскиот јазик?', 'GENERAL', 'MEDIUM', now(), now()),
    ('Кога е формирана Македонската академија на науките и уметностите (МАНУ)?', 'HISTORY', 'HARD', now(), now()),
    ('Што претставува Охридското Езеро и зошто е значајно за Македонија?', 'CULTURE', 'EASY', now(), now()),
    ('Објасни го процесот на фотосинтеза со свои зборови.', 'SCIENCE', 'MEDIUM', now(), now()),
    ('Кој е авторот на романот „Пиреј“?', 'CULTURE', 'EASY', now(), now()),
    ('Што значи зборот „ѓерѓеф“ на македонски јазик?', 'GENERAL', 'EASY', now(), now()),
    ('Опиши ја климата во Македонија низ четирите годишни времиња.', 'SCIENCE', 'MEDIUM', now(), now()),
    ('Кои се официјалните празници во Република Северна Македонија?', 'GENERAL', 'EASY', now(), now()),
    ('Објасни ја разликата помеѓу дијалект и стандарден јазик, со примери од македонскиот јазик.', 'GENERAL', 'HARD', now(), now()),
    ('Кои настани довеле до создавањето на ВМРО во 1893 година?', 'HISTORY', 'HARD', now(), now());

INSERT INTO llm_models (display_name, active, provider_type, config_json, created_at, updated_at)
VALUES ('GPT-4o mini (OpenRouter)', true, 'openrouter', '{"model":"openai/gpt-4o-mini"}', now(), now());