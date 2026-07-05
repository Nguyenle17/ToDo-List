package com.nguyen.todo_api.modules.Todo.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nguyen.todo_api.modules.Todo.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, UUID> {

    @Query("""
        SELECT t FROM Todo t
        WHERE (:completed IS NULL OR t.completed = :completed)
          AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Todo> search(
        @Param("completed") Boolean completed,
        @Param("search") String search,
        Pageable pageable
    );
}