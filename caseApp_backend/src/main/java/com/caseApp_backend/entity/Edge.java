package com.caseApp_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@Builder
public class Edge {
    @Field("id")
    private String id;
    @Field("label")
    private String label;
    @Field("sourceId")
    private String sourceId;
    @Field("sourceHandle")
    private String sourceHandle;
    @Field("targetId")
    private String targetId;
    @Field("targetHandle")
    private String targetHandle;
    @Field("type")
    private String type;
}
