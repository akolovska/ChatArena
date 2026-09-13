package mk.ukim.finki.backend.model.exceptions;

public class EvaluationNotFoundException extends RuntimeException {
    public EvaluationNotFoundException(Long id) {
        super("Evaluation not found: " + id);
    }
}