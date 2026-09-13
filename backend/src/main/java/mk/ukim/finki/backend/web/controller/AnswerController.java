package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.AskRequestDto;
import mk.ukim.finki.backend.model.dto.AskResponseDto;
import mk.ukim.finki.backend.service.IAnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ask")
public class AnswerController {

    private final IAnswerService answerService;

    public AnswerController(IAnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    public ResponseEntity<AskResponseDto> ask(@RequestBody AskRequestDto req) {
        return ResponseEntity.ok(answerService.getAnswer(req.questionId(), req.modelId()));
    }
}
