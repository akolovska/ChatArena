package mk.ukim.finki.backend.bootstrap;

import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;
import mk.ukim.finki.backend.model.enums.Role;
import mk.ukim.finki.backend.repository.LlmModelRepository;
import mk.ukim.finki.backend.repository.QuestionRepository;
import mk.ukim.finki.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataHolder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LlmModelRepository modelRepository;
    private final PasswordEncoder passwordEncoder;

    public DataHolder(UserRepository userRepository, QuestionRepository questionRepository, LlmModelRepository modelRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.modelRepository = modelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUser("user", "user@mkarena.dev", "password", Role.ROLE_USER);
            seedUser("evaluator", "evaluator@mkarena.dev", "password", Role.ROLE_EVALUATOR);
            seedUser("admin", "admin@mkarena.dev", "password", Role.ROLE_ADMIN);
        }

        if (questionRepository.count() == 0) {
            questionRepository.saveAll(List.of(
                    question("Кои се падежите во македонскиот јазик?", QuestionCategory.GENERAL, QuestionDifficulty.MEDIUM),
                    question("Кога е формирана МАНУ?", QuestionCategory.HISTORY, QuestionDifficulty.HARD),
                    question("Што претставува Охридското Езеро?", QuestionCategory.CULTURE, QuestionDifficulty.EASY)
            ));
        }

        if (modelRepository.count() == 0) {
            modelRepository.save(model("Reference Answers (Static DB)", "static-json", true));
        }
    }

    private void seedUser(String username, String email, String rawPassword, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(role);
        userRepository.save(u);
    }

    private Question question(String text, QuestionCategory category, QuestionDifficulty difficulty) {
        Question q = new Question();
        q.setText(text);
        q.setCategory(category);
        q.setDifficulty(difficulty);
        return q;
    }

    private LlmModel model(String name, String providerType, boolean active) {
        LlmModel m = new LlmModel();
        m.setDisplayName(name);
        m.setProviderType(providerType);
        m.setActive(active);
        return m;
    }
}