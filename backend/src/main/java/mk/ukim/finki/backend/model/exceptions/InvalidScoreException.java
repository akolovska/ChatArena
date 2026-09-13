package mk.ukim.finki.backend.model.exceptions;

public class InvalidScoreException extends RuntimeException {
    public InvalidScoreException(String field) {
        super(field + " must be between 1 and 5");
    }
}