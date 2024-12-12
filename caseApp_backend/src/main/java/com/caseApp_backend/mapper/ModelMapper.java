package com.caseApp_backend.mapper;

import com.caseApp_backend.dto.ModelDto;
import com.caseApp_backend.dto.ModelShortDto;
import com.caseApp_backend.entity.Model;
import org.bson.types.ObjectId;

public class ModelMapper {
    public static ModelDto ModelToModelDto(Model model) {
        return new ModelDto(model.getId().toString(),
                model.getTitle(),
                model.getDescription(),
                model.getNodes(),
                model.getEdges());
    }

    public static Model ModelDtoToModel(ModelDto modelDto) {
        ObjectId objectId = modelDto.id() == null ? new ObjectId() : new ObjectId(modelDto.id());
        return Model.builder()
                .id(objectId)
                .title(modelDto.title())
                .description(modelDto.description())
                .nodes(modelDto.nodes())
                .edges(modelDto.edges())
                .build();
    }

    public static ModelShortDto ModelToModelShortDto(Model model) {
        return new ModelShortDto(model.getId().toString(), model.getTitle(), model.getDescription());
    }
}
