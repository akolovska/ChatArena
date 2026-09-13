package mk.ukim.finki.backend.model.exceptions;

public class NoQuestionsAvailableException extends RuntimeException {
    public NoQuestionsAvailableException() {
        super("No questions available");
    }
}