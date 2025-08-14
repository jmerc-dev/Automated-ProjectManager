import Phase from "./phase.tsx";

export default function PhaseList() {
  return (
    <div className="grid [grid-template-rows:73px_auto]">
      <div className="grid [grid-template-rows:1fr_1fr] border-b-1 border-gray-400">
        <div>Header</div>
        <div>Project Name</div>
      </div>
      <div className="overflow-y-auto p-2">
        {/* Put the Phases here */}
        <Phase />
        <Phase />
        <Phase />
        <Phase />
        <Phase />
        <Phase />
      </div>
    </div>
  );
}
