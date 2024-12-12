package com.caseApp_backend.service;

import com.caseApp_backend.dto.ModelDto;
import com.caseApp_backend.entity.Model;
import com.caseApp_backend.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {
    private final ModelRepository modelRepository;

    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }

    public Model getModelById(String id) {
        return modelRepository.findById(new ObjectId(id)).orElseThrow();
    }

    public String saveModel(Model model) {
        Model newModel = modelRepository.save(model);
        return newModel.getId().toString();
    }

    public void removeModel(String id) {
        modelRepository.deleteById(new ObjectId(id));
    }
}
