package mk.ukim.finki.backend.config;

import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class EnumConverterConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(String.class, QuestionCategory.class, s -> QuestionCategory.valueOf(s.toUpperCase()));
        registry.addConverter(String.class, QuestionDifficulty.class, s -> QuestionDifficulty.valueOf(s.toUpperCase()));
    }
}
