package mk.ukim.finki.backend.model.exceptions;

public class QuestionNotFoundException extends RuntimeException {
    public QuestionNotFoundException(Long id) {
        super("Question not found: " + id);
    }
}