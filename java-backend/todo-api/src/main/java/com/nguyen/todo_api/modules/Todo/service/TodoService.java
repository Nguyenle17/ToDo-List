package com.nguyen.todo_api.modules.Todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.nguyen.todo_api.modules.Todo.dto.TodoFilterRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoResponse;
import com.nguyen.todo_api.modules.Todo.entity.Todo;
import com.nguyen.todo_api.modules.Todo.repository.TodoRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;


    // Get all todo
    public List<TodoResponse> findAll(TodoFilterRequest request) {
        int page = Optional.ofNullable(request.page()).orElse(1);
        int limit = Optional.ofNullable(request.limit()).orElse(10);
        String status = request.status();
        String search = StringUtils.hasText(request.search()) ? request.search() : null;
        String sortByField = Optional.ofNullable(request.sortBy()).orElse("createdAt");
        String sortOrder = Optional.ofNullable(request.sortOrder()).orElse("desc");

        Boolean completed = null;
        if (StringUtils.hasText(status)) {
            completed = "done".equalsIgnoreCase(status);
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        var pageable = PageRequest.of(Math.max(page - 1, 0), limit, Sort.by(direction, sortByField));

        return todoRepository.search(completed, search, pageable)
                .map(this::toResponse)
                .getContent();
    }

    // Add todo
    public TodoResponse addTodo(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        Todo saved = todoRepository.save(todo);
        return toResponse(saved);
    }

    private TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}