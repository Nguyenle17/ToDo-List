package com.nguyen.todo_api.modules.Todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.nguyen.todo_api.modules.Todo.dto.PagedResponse;
import com.nguyen.todo_api.modules.Todo.dto.TodoFilterRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoResponse;
import com.nguyen.todo_api.modules.Todo.entity.Todo;
import com.nguyen.todo_api.modules.Todo.repository.TodoRepository;

import jakarta.persistence.EntityNotFoundException;

import com.nguyen.todo_api.modules.Todo.dto.TodoUpdateRequest;
import java.util.UUID;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;


    // Get all todo
    public PagedResponse<TodoResponse> findAll(TodoFilterRequest request) {
        int page = Optional.ofNullable(request.page()).orElse(1);
        int limit = Optional.ofNullable(request.limit()).orElse(10);
        String search = StringUtils.hasText(request.search()) ? request.search() : null;
        String sortByField = Optional.ofNullable(request.sortBy()).orElse("createdAt");
        String sortOrder = Optional.ofNullable(request.sortOrder()).orElse("desc");

        final Boolean completed = StringUtils.hasText(request.status())
                ? "done".equalsIgnoreCase(request.status())
                : null;

        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        var pageable = PageRequest.of(Math.max(page - 1, 0), limit, Sort.by(direction, sortByField));

        Specification<Todo> spec = Specification.where(null);
        if (completed != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("completed"), completed));
        }
        if (StringUtils.hasText(search)) {
            String pattern = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("title")), pattern));
        }

        var pageResult = todoRepository.findAll(spec, pageable);

        List<TodoResponse> content = pageResult.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                page,
                limit,
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    // Add todo
    public TodoResponse addTodo(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        Todo saved = todoRepository.save(todo);
        return toResponse(saved);
    }

    // Update todo
    public TodoResponse updateTodo(TodoUpdateRequest request, UUID id) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Todo not found: " + id));

        if (request.title() != null) {
            todo.setTitle(request.title());
        }

        if (request.description() != null) {
            todo.setDescription(request.description());
        }

        if (request.completed() != null) {
            todo.setCompleted(request.completed());
        }

        Todo saved = todoRepository.save(todo);
        return toResponse(saved);
    }

    // Delete todo
    public void deleteTodo(UUID id) {
        Todo todo = todoRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Todo not found: " + id));

        todoRepository.deleteById(id);
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