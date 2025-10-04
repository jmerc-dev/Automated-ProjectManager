import { useState } from "react";
import Modal from "../../../components/modal";

export default function MembersManagement() {
  // Helper to get initials from name
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Placeholder data for demonstration
  const members = [
    {
      id: "1",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "Admin",
      phoneNumber: "123-456-7890",
    },
    {
      id: "2",
      name: "Bob Jones",
      email: "bob@example.com",
      role: "Editor",
      phoneNumber: "234-567-8901",
    },
    {
      id: "3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Viewer",
      phoneNumber: "345-678-9012",
    },
    {
      id: "4",
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Admin",
      phoneNumber: "456-789-0123",
    },
    {
      id: "5",
      name: "Ethan Hunt",
      email: "ethan@example.com",
      role: "Editor",
      phoneNumber: "567-890-1234",
    },
    {
      id: "6",
      name: "Fiona Gallagher",
      email: "fiona@example.com",
      role: "Viewer",
      phoneNumber: "678-901-2345",
    },
    {
      id: "7",
      name: "George Miller",
      email: "george@example.com",
      role: "Admin",
      phoneNumber: "789-012-3456",
    },
    {
      id: "8",
      name: "Hannah Lee",
      email: "hannah@example.com",
      role: "Editor",
      phoneNumber: "890-123-4567",
    },
    {
      id: "9",
      name: "Ian Curtis",
      email: "ian@example.com",
      role: "Viewer",
      phoneNumber: "901-234-5678",
    },
    {
      id: "10",
      name: "Julia Roberts",
      email: "julia@example.com",
      role: "Admin",
      phoneNumber: "012-345-6789",
    },
    {
      id: "11",
      name: "Kevin Hart",
      email: "kevin@example.com",
      role: "Editor",
      phoneNumber: "123-456-7891",
    },
    {
      id: "12",
      name: "Laura Palmer",
      email: "laura@example.com",
      role: "Viewer",
      phoneNumber: "234-567-8910",
    },
    {
      id: "13",
      name: "Mike Ross",
      email: "mike@example.com",
      role: "Admin",
      phoneNumber: "345-678-9101",
    },
    {
      id: "14",
      name: "Nina Simone",
      email: "nina@example.com",
      role: "Editor",
      phoneNumber: "456-789-1012",
    },
    {
      id: "15",
      name: "Oscar Wilde",
      email: "oscar@example.com",
      role: "Viewer",
      phoneNumber: "567-891-0123",
    },
    {
      id: "16",
      name: "Paula Abdul",
      email: "paula@example.com",
      role: "Admin",
      phoneNumber: "678-910-1234",
    },
    {
      id: "17",
      name: "Quentin Blake",
      email: "quentin@example.com",
      role: "Editor",
      phoneNumber: "789-101-2345",
    },
    {
      id: "18",
      name: "Rachel Green",
      email: "rachel@example.com",
      role: "Viewer",
      phoneNumber: "891-012-3456",
    },
    {
      id: "19",
      name: "Steve Jobs",
      email: "steve@example.com",
      role: "Admin",
      phoneNumber: "910-123-4567",
    },
    {
      id: "20",
      name: "Tina Fey",
      email: "tina@example.com",
      role: "Editor",
      phoneNumber: "101-234-5678",
    },
    {
      id: "21",
      name: "Uma Thurman",
      email: "uma@example.com",
      role: "Viewer",
      phoneNumber: "012-345-6780",
    },
    {
      id: "22",
      name: "Victor Hugo",
      email: "victor@example.com",
      role: "Admin",
      phoneNumber: "123-456-7801",
    },
    {
      id: "23",
      name: "Wendy Darling",
      email: "wendy@example.com",
      role: "Editor",
      phoneNumber: "234-567-8012",
    },
  ];

  const [searchType, setSearchType] = useState<"name" | "email" | "role">(
    "name"
  );
  const [searchValue, setSearchValue] = useState("");

  const filteredMembers = members.filter((m) => {
    if (!searchValue) return true;
    if (searchType === "name")
      return m.name.toLowerCase().includes(searchValue.toLowerCase());
    if (searchType === "email")
      return m.email.toLowerCase().includes(searchValue.toLowerCase());
    if (searchType === "role")
      return m.role.toLowerCase().includes(searchValue.toLowerCase());
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#0f6cbd] mb-10 tracking-tight">
        Project Members
      </h2>
      {/* Filters & Actions Bar */}
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-[#f7fafd] rounded-2xl border border-gray-200 shadow p-6">
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="border border-gray-300 text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <input
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f6cbd] text-sm"
            type="text"
            placeholder={`Search by ${searchType}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex-1" />
        <button
          className="bg-[#0f6cbd] text-white font-semibold rounded-lg px-6 py-2 hover:bg-[#155a8a] text-sm transition shadow w-full md:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Member
        </button>
      </div>

      {/* Modal for Add New Member */}
      <Modal
        open={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Add New Member"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      >
        <form className="flex flex-col gap-4 p-2">
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="text"
            placeholder="Full Name"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="email"
            placeholder="Email Address"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="text"
            placeholder="Phone Number"
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="text"
            placeholder="Role (e.g. Admin, Editor, Viewer)"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
          />
        </form>
      </Modal>

      {/* Members Table */}
      <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow p-8">
        <div className="overflow-x-auto rounded-xl max-h-[420px] overflow-y-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#f4f8fb] text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Phone</th>
                <th className="py-3 px-4 text-left font-semibold">Role</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No members found.
                  </td>
                </tr>
              )}
              {filteredMembers.map((m, idx) => (
                <tr
                  key={m.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#f7fafd]"
                  } hover:bg-[#e6f0fa]`}
                >
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#e6f0fa] text-[#0f6cbd] font-bold text-base shadow-sm">
                      {getInitials(m.name)}
                    </span>
                    {m.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {m.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {m.phoneNumber || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm ${
                        m.role === "Admin"
                          ? "bg-[#e6f0fa] text-[#0f6cbd]"
                          : m.role === "Editor"
                          ? "bg-[#eaf7e6] text-[#0f6cbd]"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2 justify-center items-center">
                    <button
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#e6f0fa] shadow-sm"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 shadow-sm"
                      title="Remove"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
