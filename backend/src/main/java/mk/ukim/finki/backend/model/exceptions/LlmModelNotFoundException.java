package mk.ukim.finki.backend.model.exceptions;

public class LlmModelNotFoundException extends RuntimeException {
  public LlmModelNotFoundException(Long id) {
    super("Model not found: " + id);
  }
}