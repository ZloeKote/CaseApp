package com.caseApp_backend.controller;

import com.caseApp_backend.dto.ModelDto;
import com.caseApp_backend.dto.ModelShortDto;
import com.caseApp_backend.entity.Model;
import com.caseApp_backend.mapper.ModelMapper;
import com.caseApp_backend.service.ModelService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/models")
@CrossOrigin(origins= "http://localhost:3000")
@AllArgsConstructor
public class ModelController {
    private final ModelService modelService;

    @GetMapping
    public ResponseEntity<List<ModelShortDto>> getAllModels() {
        List<ModelShortDto> models = modelService.getAllModels()
                .stream()
                .map(ModelMapper::ModelToModelShortDto)
                .toList();
        return ResponseEntity.ok(models);
    }

    @GetMapping("/{modelId}")
    public ResponseEntity<ModelDto> getModelById(@PathVariable("modelId") String modelId) {
        ModelDto model = ModelMapper.ModelToModelDto(modelService.getModelById(modelId));
        return ResponseEntity.ok(model);
    }

    @PostMapping
    public ResponseEntity<String> addModel(@RequestBody ModelDto model) {
        System.out.println(model);
        String id = modelService.saveModel(ModelMapper.ModelDtoToModel(model));
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{modelId}")
    public ResponseEntity<?> deleteModel(@PathVariable("modelId") String modelId) {
        modelService.removeModel(modelId);
        return ResponseEntity.ok().build();
    }
}
