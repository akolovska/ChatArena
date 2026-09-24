package mk.ukim.finki.backend.model.exceptions;

public class ModelEvaluationNotFoundException extends RuntimeException {
    public ModelEvaluationNotFoundException(Long id) {
        super("Model evaluation not found: " + id);
    }
}