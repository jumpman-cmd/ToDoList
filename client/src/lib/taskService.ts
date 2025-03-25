import { apiRequest } from "./queryClient";
import { Task } from "@shared/schema";

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSortOption = 'dueDate' | 'dueDateDesc' | 'alphabetical' | 'creationDate';

export const taskService = {
  // Fetch all tasks from the API
  async getTasks(): Promise<Task[]> {
    const response = await apiRequest("GET", "/api/tasks");
    return response.json();
  },

  // Create a new task
  async createTask(task: {
    title: string;
    description?: string;
    dueDate?: string | Date;
    priority: string;
  }): Promise<Task> {
    const response = await apiRequest("POST", "/api/tasks", task);
    return response.json();
  },

  // Update an existing task
  async updateTask(
    id: number,
    updates: Partial<{
      title: string;
      description?: string;
      dueDate?: string | Date;
      priority: string;
      completed: boolean;
    }>
  ): Promise<Task> {
    const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
    return response.json();
  },

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/tasks/${id}`);
  },

  // Filter tasks based on the filter type
  filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }
  },

  // Sort tasks based on the sort option
  sortTasks(tasks: Task[], sortOption: TaskSortOption): Task[] {
    return [...tasks].sort((a, b) => {
      switch (sortOption) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'dueDateDesc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'creationDate':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }
};
