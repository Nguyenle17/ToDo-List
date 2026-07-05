package com.nguyen.todo_api.modules.Todo.dto;

public record TodoUpdateRequest(
    String title,
    String description,
    Boolean completed
) {}