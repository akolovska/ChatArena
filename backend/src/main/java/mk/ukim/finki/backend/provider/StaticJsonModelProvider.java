package mk.ukim.finki.backend.provider;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import mk.ukim.finki.backend.model.domain.Question;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Component
public class StaticJsonModelProvider implements ModelProvider {

    private Map<String, Map<String, String>> answersByModel; // modelId(as string) -> questionId(as string) -> answer

    @PostConstruct
    void load() throws IOException {
        try (InputStream is = getClass().getResourceAsStream("/data/model-answers.json")) {
            ObjectMapper mapper = new ObjectMapper();
            answersByModel = mapper.readValue(is, new TypeReference<>() {});
        }
    }

    @Override
    public String getAnswer(Long modelId, Question question) {
        var forModel = answersByModel.getOrDefault(String.valueOf(modelId), Map.of());
        return forModel.getOrDefault(String.valueOf(question.getId()),
                "Нема достапен одговор за ова прашање од избраниот модел.");
    }
}
