package mk.ukim.finki.backend.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mk.ukim.finki.backend.model.domain.LlmModel;
import mk.ukim.finki.backend.model.domain.Question;
import mk.ukim.finki.backend.model.exceptions.ModelProviderException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.Duration;

@Component
@Profile("prod")
public class OpenRouterModelProvider implements ModelProvider {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.api.key}")
    private String apiKey;

    public OpenRouterModelProvider(@Value("${openrouter.base-url}") String baseUrl,
                                   ObjectMapper objectMapper) {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(10))
                .withReadTimeout(Duration.ofSeconds(30));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(ClientHttpRequestFactoryBuilder.detect().build(settings))
                .build();
        this.objectMapper = objectMapper;

//        ArrayNode messages = requestBody.putArray("messages");
//
//        ObjectNode systemMessage = messages.addObject();
//        systemMessage.put("role", "system");
//        systemMessage.put("content", "You are a helpful assistant. Always respond in Macedonian language (македонски јазик), using proper Cyrillic script and correct grammar.");
//
//        ObjectNode userMessage = messages.addObject();
//        userMessage.put("role", "user");
//        userMessage.put("content", question.getText());
    }

    @Override
    public String getAnswer(LlmModel model, Question question) {
        String openRouterModel = extractModelName(model.getConfigJson());

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", openRouterModel);

        ArrayNode messages = requestBody.putArray("messages");
        ObjectNode userMessage = messages.addObject();
        userMessage.put("role", "user");
        userMessage.put("content", question.getText());

        try {
            JsonNode response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            return response
                    .path("choices").path(0)
                    .path("message").path("content")
                    .asText("Нема одговор од моделот.");
        } catch (Exception e) {
            throw new ModelProviderException("OpenRouter request failed: " + e.getMessage());
        }
    }

    private String extractModelName(String configJson) {
        try {
            JsonNode config = objectMapper.readTree(configJson == null ? "{}" : configJson);
            JsonNode modelNode = config.get("model");
            if (modelNode == null || modelNode.asText().isBlank()) {
                throw new ModelProviderException("Model config is missing required 'model' field");
            }
            return modelNode.asText();
        } catch (IOException e) {
            throw new ModelProviderException("Invalid model config JSON");
        }
    }
}