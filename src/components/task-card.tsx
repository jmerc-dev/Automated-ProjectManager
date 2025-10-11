import React from "react";
import ProgressBar from "./progress-bar";
import type { Task } from "../types/task";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-2 mb-4">
      <div className="font-semibold text-lg text-gray-900">{task.name}</div>
      <div className="text-sm text-gray-700">{task.notes}</div>
      <ProgressBar progress={task.progress} />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">{task.progress}% complete</span>
        <span className="text-xs text-gray-500">Due:</span>
      </div>
    </div>
  );
}
