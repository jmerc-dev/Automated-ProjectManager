import React, { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";

type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
};

interface Props {
  tasks: Task[];
}

const GanttChart: React.FC<Props> = ({ tasks }) => {
  const ganttRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ganttRef.current || tasks.length === 0) return;

    ganttRef.current.innerHTML = "";

    new Gantt(ganttRef.current, tasks, {
      view_mode: "Day",
      on_click: () => {},
      on_date_change: () => {},
      on_progress_change: () => {},
      on_view_change: () => {},
    });
  }, [tasks]);

  return <div ref={ganttRef} />;
};

export default GanttChart;
