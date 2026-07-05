package com.nguyen.todo_api.modules.Todo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyen.todo_api.modules.Todo.dto.TodoFilterRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoResponse;
import com.nguyen.todo_api.modules.Todo.dto.TodoUpdateRequest;
import com.nguyen.todo_api.modules.Todo.service.TodoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {
    
    private final TodoService todoService;
    // Get all todos
    @GetMapping
    public List<TodoResponse> getAllTodos(@ModelAttribute TodoFilterRequest request) {
        return todoService.findAll(request);
    }

    // Create todo
    @PostMapping
    public TodoResponse addTodo(@RequestBody TodoRequest request) {
        return todoService.addTodo(request);
    }

    // Update todo status
    @PatchMapping("/{id}")
    public TodoResponse updateTodo(@PathVariable UUID id, @RequestBody TodoUpdateRequest request) {
        return todoService.updateTodo(request, id);
    }
}
