package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.dto.LlmModelDto;
import mk.ukim.finki.backend.service.IModelService;
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
    public List<LlmModelDto> findAll() { return modelService.findAll(); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LlmModelDto create(@RequestBody LlmModelDto dto) { return modelService.create(dto); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LlmModelDto update(@PathVariable Long id, @RequestBody LlmModelDto dto) {
        return modelService.update(id, dto);
    }
}
