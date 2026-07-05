package com.nguyen.todo_api.modules.Todo.dto;

public record TodoFilterRequest(
    Integer page,
    Integer limit,
    String status,
    String search,
    String sortBy,
    String sortOrder
) {}