package mk.ukim.finki.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum QuestionDifficulty {
    EASY, MEDIUM, HARD;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static QuestionDifficulty fromJson(String value) {
        return QuestionDifficulty.valueOf(value.toUpperCase());
    }
}