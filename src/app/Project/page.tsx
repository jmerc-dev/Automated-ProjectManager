// import { ReactComponent as TaskIcon } from "../../assets/svg/task.svg";

function Page() {
  return (
    <div className="grid [grid-template-rows:auto_1fr] [grid-template-columns:70px_1fr] h-screen font-display">
      <nav className="bg-cyan-900 col-span-2">
        <div className="grid [grid-template-columns:70px_auto_1fr] m-3 text-amber-50">
          <div>logo</div>
          <h1 className="font-semibold">Project Name</h1>
          <div className="flex justify-end space-x-8">
            <div>b1</div>
            <div>b2</div>
            <div>b3</div>
          </div>
        </div>
      </nav>
      <aside className="border-r-1 border-r-gray-400 flex flex-col text-center *:hover:bg-gray-300 *:cursor-pointer">
        <div>Tasks</div>
        <div>Members</div>
        <div>Reports</div>
      </aside>
      <main className="m-3">main</main>
    </div>
  );
}

export default Page;
