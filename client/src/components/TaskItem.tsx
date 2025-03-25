import React from "react";
import { Task } from "@shared/schema";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggleCompletion: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onEdit,
  onDelete,
}) => {
  // Format due date if available
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM d, yyyy")
    : null;

  // Determine priority badge class
  let priorityBadgeClass = "text-xs px-2 py-1 rounded";
  let priorityText = "Medium Priority";

  if (task.priority === "high") {
    priorityBadgeClass += " bg-red-100 text-red-800";
    priorityText = "High Priority";
  } else if (task.priority === "medium") {
    priorityBadgeClass += " bg-yellow-100 text-yellow-800";
    priorityText = "Medium Priority";
  } else {
    priorityBadgeClass += " bg-green-100 text-green-800";
    priorityText = "Low Priority";
  }

  return (
    <li className="bg-white rounded-lg shadow p-4 flex flex-col">
      {/* Task Header (title and actions) */}
      <div className="flex items-start justify-between mb-2">
        {/* Checkbox and title */}
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggleCompletion}
            className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 mr-3 mt-0.5"
          />
          <div className="flex flex-col">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {formattedDueDate && (
              <span className="text-sm text-gray-500 mt-1">
                Due: {formattedDueDate}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 text-gray-400">
          <button onClick={onEdit} className="hover:text-gray-600">
            <i className="fas fa-edit"></i>
          </button>
          <button onClick={onDelete} className="hover:text-gray-600">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Description if available */}
      {task.description && (
        <p
          className={`text-sm mt-2 ${
            task.completed ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Priority badge */}
      <div className="mt-3 flex">
        <span className={priorityBadgeClass}>{priorityText}</span>
      </div>
    </li>
  );
};
