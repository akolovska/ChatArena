package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.LeaderboardEntryDto;
import mk.ukim.finki.backend.model.dto.LlmModelDto;
import mk.ukim.finki.backend.service.IModelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/models")
public class ModelController {

    private final IModelService modelService;

    public ModelController(IModelService modelService) {
        this.modelService = modelService;
    }

    @GetMapping
    public ResponseEntity<List<LlmModelDto>> findAll() {
        return ResponseEntity.ok(modelService.findAll()); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LlmModelDto> update(@PathVariable Long id, @RequestBody LlmModelDto dto) {
        return ResponseEntity.ok(modelService.update(id, dto));
    }

    @GetMapping("/models/leaderboard")
    public List<LeaderboardEntryDto> leaderboard() {
        return leaderboardService.getLeaderboard();
    }
}
