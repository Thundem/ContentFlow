package com.coursework.ContentFlow.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class FieldErrorResponse {
    private Map<String, String> errors;
}
