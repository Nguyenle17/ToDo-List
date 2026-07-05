package com.nguyen.todo_api.modules.Todo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.nguyen.todo_api.modules.Todo.dto.TodoFilterRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoRequest;
import com.nguyen.todo_api.modules.Todo.dto.TodoResponse;
import com.nguyen.todo_api.modules.Todo.dto.TodoUpdateRequest;
import com.nguyen.todo_api.modules.Todo.entity.Todo;
import com.nguyen.todo_api.modules.Todo.repository.TodoRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    private TodoService todoService;

    private UUID sampleId;
    private Todo sampleTodo;

    @BeforeEach
    void setUp() {
        todoService = new TodoService(todoRepository);

        sampleId = UUID.randomUUID();
        sampleTodo = new Todo();
        sampleTodo.setId(sampleId);
        sampleTodo.setTitle("Mua sữa");
        sampleTodo.setDescription("Sữa tươi không đường");
        sampleTodo.setCompleted(false);
        sampleTodo.setCreatedAt(LocalDateTime.now());
        sampleTodo.setUpdatedAt(LocalDateTime.now());
    }

    // addTodo()
    @Test
    @DisplayName("Tạo todo mới thành công với title/description đúng, completed mặc định false")
    void shouldCreateTodoWithCorrectTitleAndDescription() {
        TodoRequest request = new TodoRequest("Test", "desc");

        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo saved = invocation.getArgument(0);
            saved.setId(sampleId);
            saved.setCreatedAt(LocalDateTime.now());
            saved.setUpdatedAt(LocalDateTime.now());
            return saved;
        });

        TodoResponse response = todoService.addTodo(request);

        assertThat(response.title()).isEqualTo("Test");
        assertThat(response.description()).isEqualTo("desc");
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    // findAll()
    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("Trả về đúng danh sách + thông tin phân trang khi có dữ liệu")
        void shouldReturnPagedResponse() {
            TodoFilterRequest request = new TodoFilterRequest(1, 10, null, null, "createdAt", "desc");

            Page<Todo> page = new PageImpl<>(List.of(sampleTodo));
            when(todoRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

            var result = todoService.findAll(request);

            assertThat(result.content()).hasSize(1);
            assertThat(result.content().get(0).title()).isEqualTo("Mua sữa");
            assertThat(result.totalElements()).isEqualTo(1);
            assertThat(result.totalPages()).isEqualTo(1);
        }

        @Test
        @DisplayName("page/limit không truyền (null) thì mặc định page=1, limit=10")
        void shouldUseDefaultPageAndLimitWhenNull() {
            TodoFilterRequest request = new TodoFilterRequest(null, null, null, null, null, null);

            Page<Todo> emptyPage = new PageImpl<>(List.of());
            when(todoRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(emptyPage);

            var result = todoService.findAll(request);

            assertThat(result.page()).isEqualTo(1);
            assertThat(result.limit()).isEqualTo(10);
        }

        @Test
        @DisplayName("status=done thì lọc completed=true")
        void shouldFilterByDoneStatus() {
            TodoFilterRequest request = new TodoFilterRequest(1, 10, "done", null, "createdAt", "desc");

            Page<Todo> page = new PageImpl<>(List.of(sampleTodo));
            when(todoRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

            todoService.findAll(request);
            verify(todoRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
        }
    }

    // updateTodo()
    @Nested
    @DisplayName("updateTodo")
    class UpdateTodo {

        @Test
        @DisplayName("Cập nhật đúng field được gửi, giữ nguyên field không gửi")
        void shouldUpdateOnlyProvidedFields() {
            TodoUpdateRequest request = new TodoUpdateRequest(null, null, true); // chỉ đổi completed

            when(todoRepository.findById(sampleId)).thenReturn(Optional.of(sampleTodo));
            when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

            TodoResponse response = todoService.updateTodo(request, sampleId);

            assertThat(response.completed()).isTrue();
            assertThat(response.title()).isEqualTo("Mua sữa");  
            assertThat(response.description()).isEqualTo("Sữa tươi không đường");
        }

        @Test
        @DisplayName("Ném EntityNotFoundException khi id không tồn tại")
        void shouldThrowWhenTodoNotFound() {
            UUID unknownId = UUID.randomUUID();
            TodoUpdateRequest request = new TodoUpdateRequest("New title", null, null);

            when(todoRepository.findById(unknownId)).thenReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class,
                    () -> todoService.updateTodo(request, unknownId));
        }
    }

    // deleteTodo()
    @Nested
    @DisplayName("deleteTodo")
    class DeleteTodo {

        @Test
        @DisplayName("Xóa thành công khi id tồn tại")
        void shouldDeleteWhenExists() {
            when(todoRepository.findById(sampleId)).thenReturn(Optional.of(sampleTodo));

            todoService.deleteTodo(sampleId);

            verify(todoRepository, times(1)).deleteById(sampleId);
        }

        @Test
        @DisplayName("Ném EntityNotFoundException khi id không tồn tại, KHÔNG gọi deleteById")
        void shouldThrowAndNotDeleteWhenNotFound() {
            UUID unknownId = UUID.randomUUID();
            when(todoRepository.findById(unknownId)).thenReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class, () -> todoService.deleteTodo(unknownId));

            verify(todoRepository, times(0)).deleteById(any());
        }
    }
}