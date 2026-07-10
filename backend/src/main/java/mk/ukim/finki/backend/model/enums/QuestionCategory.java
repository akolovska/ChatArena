package mk.ukim.finki.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum QuestionCategory {
    GENERAL, SCIENCE, HISTORY, CULTURE;
    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static QuestionCategory fromJson(String value) {
        return QuestionCategory.valueOf(value.toUpperCase());
    }
}
