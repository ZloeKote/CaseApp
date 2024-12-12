package com.caseApp_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
public class Position {
    @Field("x")
    private int x;
    @Field("y")
    private int y;
}
