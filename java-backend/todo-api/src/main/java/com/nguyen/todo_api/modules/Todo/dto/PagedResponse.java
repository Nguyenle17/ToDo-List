package com.nguyen.todo_api.modules.Todo.dto;

import java.util.List;

public record PagedResponse<T>(
    List<T> content,
    int page,
    int limit,
    long totalElements,
    int totalPages
) {}