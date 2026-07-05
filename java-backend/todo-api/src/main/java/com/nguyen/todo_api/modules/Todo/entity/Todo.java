package com.nguyen.todo_api.modules.Todo.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    @JoinColumn(name = "title", referencedColumnName = "title")
    private String title;

    @Column(columnDefinition = "TEXT")
    @JoinColumn(name = "description", referencedColumnName = "description")
    private String description;

    @Column(nullable = false)
    @JoinColumn(name = "completed", referencedColumnName = "completed")
    private Boolean completed = false;

    @Column(nullable = false, updatable = false)
    @JoinColumn(name = "created_at", referencedColumnName = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @JoinColumn(name = "updated_at", referencedColumnName = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (completed == null) {
            completed = false;
        }
    }
}