package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.QuestionDto;
import mk.ukim.finki.backend.model.enums.QuestionCategory;
import mk.ukim.finki.backend.model.enums.QuestionDifficulty;
import mk.ukim.finki.backend.service.IQuestionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final IQuestionService questionService;

    public QuestionController(IQuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<QuestionDto> findAll(
            @RequestParam(required = false) QuestionCategory category,
            @RequestParam(required = false) QuestionDifficulty difficulty
    ) {
        return questionService.findAll(category, difficulty);
    }

    @GetMapping("/random")
    public QuestionDto random() {
        return questionService.findRandom();
    }
}
