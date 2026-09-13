package mk.ukim.finki.backend.model.exceptions;

public class InvalidModelConfigException extends RuntimeException {
    public InvalidModelConfigException() {
        super("Invalid model config — must be a valid JSON object");
    }
}