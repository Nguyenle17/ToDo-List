package com.nguyen.todo_api.modules.Todo.dto;

public record TodoRequest (
    String title,
    String description
) {}
