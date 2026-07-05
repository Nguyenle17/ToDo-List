import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "@/api/todo.api";

export function useTodos(filter) {
    const queryClient = useQueryClient();

    const {
        data: todos = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["todos", filter],
        queryFn: () => todoApi.getTodos(filter),
        staleTime: 1000 * 60 * 5,
    });

    const addTodo = useMutation({
        mutationFn: todoApi.createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const editTodo = useMutation({
        mutationFn: ({ id, data }) => todoApi.updateTodo(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const removeTodo = useMutation({
        mutationFn: todoApi.deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const totalPage = useMutation({
        mutationFn: todoApi.totalPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["total-pages"] });
        },
    })

    return {
        todos,
        loading,
        error,
        addTodo: addTodo.mutate,
        editTodo: editTodo.mutate,
        removeTodo: removeTodo.mutate,
    };
}