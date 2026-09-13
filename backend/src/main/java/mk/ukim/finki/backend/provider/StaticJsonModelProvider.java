package mk.ukim.finki.backend.provider;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Component
public class StaticJsonModelProvider implements ModelProvider {

    private Map<String, Map<String, String>> answersByModel;

    @PostConstruct
    void load() throws IOException {
        try (InputStream is = getClass().getResourceAsStream("/data/model-answers.json")) {
            if (is == null) {
                throw new IllegalStateException(
                        "model-answers.json not found on classpath — expected at src/main/resources/data/model-answers.json"
                );
            }
            ObjectMapper mapper = new ObjectMapper();
            answersByModel = mapper.readValue(is, new TypeReference<>() {});
        }
    }

    @Override
    public String getAnswer(LlmModel model, Question question) {
        var forModel = answersByModel.getOrDefault(String.valueOf(model.getId()), Map.of());
        return forModel.getOrDefault(String.valueOf(question.getId()),
                "Нема достапен одговор за ова прашање од избраниот модел.");
    }
}
