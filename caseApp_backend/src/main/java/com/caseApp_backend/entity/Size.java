package com.caseApp_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
public class Size {
    @Field("width")
    private int width;
    @Field("height")
    private int height;
}