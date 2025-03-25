import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { taskService, type TaskFilter, type TaskSortOption } from "@/lib/taskService";
import { Task } from "@shared/schema";
import { AppBorder } from "@/components/AppBorder";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { TaskModal } from "@/components/TaskModal";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function TaskFlow() {
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>("all");
  const [currentSort, setCurrentSort] = useState<TaskSortOption>("dueDate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
    staleTime: 10000,
  });

  // Task mutations
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) => 
      taskService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Process tasks based on filter and sort
  const filteredTasks = taskService.filterTasks(tasks, currentFilter);
  const sortedTasks = taskService.sortTasks(filteredTasks, currentSort);
  
  // Count active and completed tasks
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  // Handle tab change
  const handleTabChange = (filter: TaskFilter) => {
    setCurrentFilter(filter);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setCurrentSort(value as TaskSortOption);
  };

  // Open modal to add new task
  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  // Open modal to edit task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  // Toggle task completion
  const handleToggleCompletion = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: !task.completed },
    });
  };

  // Delete task
  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  // Save task (create or update)
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (currentTask) {
      // Update existing task
      updateTaskMutation.mutate({
        id: currentTask.id,
        updates: taskData,
      });
    } else {
      // Create new task
      createTaskMutation.mutate(taskData as any);
    }
    setIsModalOpen(false);
  };

  return (
    <AppBorder>
      <div className="bg-white rounded-xl p-8 min-h-[600px] flex flex-col">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-500">TaskFlow</h1>
          <p className="text-gray-500 mt-2">
            <span>{activeTasks}</span> active tasks, <span>{completedTasks}</span> completed
          </p>
        </header>

        {/* Action Bar */}
        <div className="flex justify-between mb-8">
          <div>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    currentFilter === "all"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => handleTabChange("active")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    currentFilter === "active"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleTabChange("completed")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    currentFilter === "completed"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
          </div>

          <div className="flex items-center">
            {/* Sort Dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Sort by:</span>
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date (earliest)</SelectItem>
                    <SelectItem value="dueDateDesc">Due Date (latest)</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="creationDate">Creation Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Task Button */}
            <Button 
              onClick={handleAddTask} 
              className="ml-4 bg-task-dark text-white px-3 py-2 h-8 text-sm"
              variant="default"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add Task
            </Button>
          </div>
        </div>

        {/* Task List Container */}
        <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : sortedTasks.length > 0 ? (
            <TaskList 
              tasks={sortedTasks} 
              onToggleCompletion={handleToggleCompletion}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <EmptyState onAddNewTask={handleAddTask} />
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
      />
    </AppBorder>
  );
}
