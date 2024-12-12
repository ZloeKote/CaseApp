package com.caseApp_backend.dto;

import com.caseApp_backend.entity.Edge;
import com.caseApp_backend.entity.Node;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

public record ModelDto(
        String id,
        String title,
        String description,
        List<Node> nodes,
        List<Edge> edges
) {
}
