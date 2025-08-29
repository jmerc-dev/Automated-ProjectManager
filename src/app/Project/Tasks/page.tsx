import GanttChart from "../../../components/gantt-chart";
import "../../../styles/frappe-gantt.css";
import PhaseList from "../../../components/phase-list";

const tasks = [
  {
    id: "1",
    name: "Design",
    start: "2025-08-01",
    end: "2025-08-05",
    progress: 30,
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
  {
    id: "2",
    name: "Development",
    start: "2025-08-06",
    end: "2025-08-10",
    progress: 10,
    dependencies: "1",
  },
];

function TasksView() {
  return (
    <div className="grid [grid-template-rows:50px_1fr]">
      <div>commands</div>
      <div className="grid pl-3 pr-3 bg-white border border-transparent rounded-xl">
        <div className="grid h-700 [grid-template-columns:700px_1fr]">
          <div className="border-r-1 border-gray-400 text-[0.9rem] p-3">
            <PhaseList />
          </div>
          <div className="h-full overflow-auto">
            <GanttChart tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksView;
