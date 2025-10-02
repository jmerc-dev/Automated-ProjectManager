import MembersTable from "./members-table";

export default function MembersManagement() {
  return (
    <div className="grid grid-cols-12 text-base font">
      <div className="col-span-2 flex flex-col gap-4">
        <div className="text-lg font-semibold">Filter & Actions</div>
        <div className="w-full">
          <input
            className="w-full px-1 py-2 border-1 border-gray-300 rounded-md text-sm"
            type="text"
            placeholder="Search members"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Role</label>
          <select className="border-1 border-gray-300 text-sm rounded-md px-1 py-2">
            <option value={"All"}>All Role</option>
            <option value={"Option 1"}>Option 1</option>
            <option value={"Option 2"}>Option 2</option>
          </select>
        </div>
        <div>
          <button className="bg-primary text-white font-semibold border-1 rounded-lg w-full py-2 hover:bg-primary-dark text-sm">
            Add New Member
          </button>
        </div>
      </div>
      <div className="col-span-10 px-7">
        <div className="text-2xl font-bold">Project Members</div>
        <div className="p-7">
          <MembersTable />
        </div>
      </div>
    </div>
  );
}
