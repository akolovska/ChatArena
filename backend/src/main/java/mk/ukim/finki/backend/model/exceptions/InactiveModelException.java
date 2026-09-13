package mk.ukim.finki.backend.model.exceptions;

public class InactiveModelException extends RuntimeException {
    public InactiveModelException(Long modelId) {
        super("Model is not currently active: " + modelId);
    }
}
