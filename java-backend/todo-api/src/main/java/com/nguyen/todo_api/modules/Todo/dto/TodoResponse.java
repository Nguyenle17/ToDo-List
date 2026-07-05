package com.nguyen.todo_api.modules.Todo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TodoResponse (
    UUID id,
    String title,
    String description,
    Boolean completed,
    LocalDateTime createdAt,
    LocalDateTime updatedAt 
) {}
