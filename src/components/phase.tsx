import Task from "./task.tsx";

function Phase() {
  return (
    <div className="grid m-1 [grid-template-columns:100px_1fr]">
      <div>Requirements and gathering</div>
      <div>
        <Task />
        <Task />
        <Task />
      </div>
    </div>
  );
}

export default Phase;
