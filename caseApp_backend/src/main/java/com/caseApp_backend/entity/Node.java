package com.caseApp_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@Builder
public class Node {
    @Field("id")
    private String id;
    @Field("label")
    private String label;
    @Field("size")
    private Size size;
    @Field("position")
    private Position position;
    @Field("type")
    private String type;
}
