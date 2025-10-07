import { useEffect, useState } from "react";
import Modal from "../../../components/modal";
import type { Member } from "../../../types/member";
import {
  addMember,
  deleteMember,
  updateMember,
} from "../../../services/firestore/members";
import { onMembersSnapshot } from "../../../services/firestore/members";

interface MembersManagementProps {
  projectId: string;
}

export default function MembersManagement({
  projectId,
}: MembersManagementProps) {
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  useEffect(() => {
    const unsubscribe = onMembersSnapshot(projectId, setMembers);
    return () => unsubscribe();
  }, [projectId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editMember, setEditMember] = useState<Partial<Member>>({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setnewRole] = useState("");
  const [newPhoneNumber, setnewPhoneNumber] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  const handleAddMember = () => {
    if (
      !newFullName.trim() ||
      !newEmail.trim() ||
      !newRole.trim() ||
      !newPhoneNumber.trim()
    )
      return;

    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    addMember(projectId, {
      name: newFullName,
      emailAddress: newEmail,
      role: newRole,
      phoneNumber: newPhoneNumber,
    } as Omit<Member, "id">).then((id) => {
      setMembers([
        ...members,
        {
          id: id,
          name: newFullName,
          emailAddress: newEmail,
          role: newRole,
          phoneNumber: newPhoneNumber,
        },
      ]);
      setNewFullName("");
      setNewEmail("");
      setnewRole("");
      setnewPhoneNumber("");
    });
    setIsModalOpen(false);
  };

  const [searchType, setSearchType] = useState<"name" | "email" | "role">(
    "name"
  );
  const [searchValue, setSearchValue] = useState("");

  const filteredMembers = members.filter((m) => {
    if (!searchValue) return true;
    if (searchType === "name")
      return m.name.toLowerCase().includes(searchValue.toLowerCase());
    if (searchType === "email")
      return m.emailAddress.toLowerCase().includes(searchValue.toLowerCase());
    if (searchType === "role")
      return m.role.toLowerCase().includes(searchValue.toLowerCase());
    return true;
  });

  function handleEdit(idx: number, m: Member) {
    setEditIdx(idx);
    setEditMember({ ...m });
  }

  function handleEditChange(field: keyof Member, value: string) {
    setEditMember((prev) => ({ ...prev, [field]: value }));
  }

  function handleEditSave(idx: number) {
    updateMember(projectId, editMember.id!, editMember as Member);

    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...editMember } : m))
    );

    setEditIdx(null);
    setEditMember({});
  }

  function handleEditCancel() {
    setEditIdx(null);
    setEditMember({});
  }

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
        onConfirm={handleAddMember}
      >
        <form className="flex flex-col gap-4 p-2">
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="text"
            placeholder="Full Name"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="email"
            placeholder="Email Address"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="tel"
            inputMode="tel"
            pattern="[0-9()+\-\s]{7,20}"
            title="Phone number (digits, spaces, +, -, and parentheses only)"
            placeholder="Phone Number"
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
            required
            value={newPhoneNumber}
            onChange={(e) => setnewPhoneNumber(e.target.value)}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/[^0-9()+\-\s]/g, "");
            }}
          />
          <input
            className="rounded-2xl border border-[#d1e4f7] bg-white/60 backdrop-blur-md px-4 py-2 text-gray-900 font-medium shadow focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/30 transition placeholder:text-gray-500 hover:bg-white/80"
            type="text"
            placeholder="Role (e.g. Designer, Developer, Manager)"
            required
            style={{ boxShadow: "0 1.5px 8px 0 rgba(15,108,189,0.07)" }}
            value={newRole}
            onChange={(e) => setnewRole(e.target.value)}
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
                  {editIdx === idx ? (
                    <>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#e6f0fa] text-[#0f6cbd] font-bold text-base shadow-sm">
                          {getInitials(editMember.name || "")}
                        </span>
                        <input
                          className="border rounded px-2 py-1 text-sm w-32"
                          value={editMember.name || ""}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        <input
                          className="border rounded px-2 py-1 text-sm w-40"
                          value={editMember.emailAddress || ""}
                          onChange={(e) =>
                            handleEditChange("emailAddress", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        <input
                          className="border rounded px-2 py-1 text-sm w-28"
                          value={editMember.phoneNumber || ""}
                          onChange={(e) =>
                            handleEditChange(
                              "phoneNumber",
                              e.target.value.replace(/[^0-9()+\-\s]/g, "")
                            )
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          className="border rounded px-2 py-1 text-sm w-24"
                          value={editMember.role || ""}
                          onChange={(e) =>
                            handleEditChange("role", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 flex gap-2 justify-center items-center">
                        <button
                          className="bg-[#0f6cbd] text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#155a8a] shadow-sm"
                          title="Save"
                          onClick={() => handleEditSave(idx)}
                        >
                          ✔
                        </button>
                        <button
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#e6f0fa] shadow-sm"
                          title="Cancel"
                          onClick={handleEditCancel}
                        >
                          ✕
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#e6f0fa] text-[#0f6cbd] font-bold text-base shadow-sm">
                          {getInitials(m.name)}
                        </span>
                        {m.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {m.emailAddress}
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
                          onClick={() => handleEdit(idx, m)}
                        >
                          ✎
                        </button>
                        <button
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 shadow-sm"
                          title="Remove"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to remove this member?"
                              )
                            ) {
                              deleteMember(projectId, m.id);
                              setMembers((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }
                          }}
                        >
                          🗑
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
