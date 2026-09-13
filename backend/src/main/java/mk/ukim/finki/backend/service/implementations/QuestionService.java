package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.dto.QuestionDto;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;
import mk.ukim.finki.backend.model.exceptions.NoQuestionsAvailableException;
import mk.ukim.finki.backend.repository.QuestionRepository;
import mk.ukim.finki.backend.service.IQuestionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService implements IQuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public List<QuestionDto> findAll(QuestionCategory category, QuestionDifficulty difficulty) {
        List<Question> questions;

        if (category != null && difficulty != null) {
            questions = questionRepository.findByCategoryAndDifficulty(category, difficulty);
        } else if (category != null) {
            questions = questionRepository.findByCategory(category);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(difficulty);
        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream().map(this::toDto).toList();
    }

    @Override
    public QuestionDto findRandom() {
        Question question = questionRepository.findRandomQuestion();
        if (question == null) {
            throw new NoQuestionsAvailableException();
        }
        return toDto(question);
    }

    private QuestionDto toDto(Question q) {
        return new QuestionDto(q.getId(), q.getText(), q.getCategory(), q.getDifficulty());
    }
}