package com.caseApp_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Document(collection = "caseModels")
public class Model {
    @Id
    @Field("_id")
    private ObjectId id;
    @Field("title")
    private String title;
    @Field("description")
    private String description;
    @Field("nodes")
    private List<Node> nodes;
    @Field("edges")
    private List<Edge> edges;
}
