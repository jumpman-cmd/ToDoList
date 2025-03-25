import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddNewTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddNewTask }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <i className="fa-regular fa-clipboard text-gray-400 text-4xl"></i>
      </div>
      <p className="text-gray-500 font-medium">No tasks found</p>
      <p className="text-gray-400 text-sm mt-1">
        Get started by creating your first task.
      </p>
      <Button
        onClick={onAddNewTask}
        className="mt-6 bg-gray-900 text-white px-4 py-2 rounded text-sm flex items-center"
      >
        <i className="fa-solid fa-plus mr-2"></i> Add a New Task
      </Button>
    </div>
  );
};
