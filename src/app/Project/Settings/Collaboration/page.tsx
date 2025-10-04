import { useEffect, useState } from "react";
import type { Collaborator } from "../../../../types/collaborator";
import {
  addCollaborator,
  listenToCollaborators,
  removeCollaborator,
  updateCollaborator,
} from "../../../../services/firestore/collaborators";

const initialCollaborators: Collaborator[] = [];

interface CollaborationSettingsProps {
  projectId: string;
}

export default function CollaborationSettings({
  projectId,
}: CollaborationSettingsProps) {
  const [collaborators, setCollaborators] =
    useState<Collaborator[]>(initialCollaborators);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "viewer" | "admin">(
    "viewer"
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<"editor" | "viewer" | "admin">(
    "viewer"
  );
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const unsubscribe = listenToCollaborators(projectId, setCollaborators);
    return () => unsubscribe();
  }, [projectId]);

  const isEmailExisting = (email: string) => {
    return collaborators.some(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
  };

  const handleAddCollaborator = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (isEmailExisting(newEmail)) {
      alert("This email is already a collaborator.");
      return;
    }

    addCollaborator(projectId, {
      name: newName,
      email: newEmail,
      access: newRole,
      joinedAt: new Date(),
    } as Omit<Collaborator, "id">).then((id) => {
      setCollaborators([
        ...collaborators,
        {
          id: id,
          name: newName,
          email: newEmail,
          access: newRole,
          joinedAt: new Date(),
        },
      ]);
      setNewName("");
      setNewEmail("");
      setNewRole("viewer");
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
    removeCollaborator(projectId, id);
  };

  const startEdit = (
    id: string,
    currentRole: "editor" | "viewer" | "admin"
  ) => {
    setEditId(id);
    setEditRole(currentRole);
  };

  const saveEdit = (id: string) => {
    updateCollaborator(projectId, id, { access: editRole });
    setCollaborators(
      collaborators.map((c) => (c.id === id ? { ...c, access: editRole } : c))
    );

    setEditId(null);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-[#0f6cbd] mb-6">
        Collaborator Settings
      </h2>
      <div className="mb-8">
        <h3 className="font-medium mb-2">Add Collaborator</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]"
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]"
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as "editor" | "viewer")}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            className="bg-[#0f6cbd] text-white px-4 py-2 rounded hover:bg-[#155a8a] transition"
            onClick={handleAddCollaborator}
          >
            Add
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Current Collaborators</h3>
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#f4f8fb] text-gray-700 sticky top-0 z-10">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Access</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No collaborators yet.
                  </td>
                </tr>
              )}
              {collaborators.map((c, idx) => (
                <tr
                  key={c.id}
                  className={
                    `transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f7fafd]"
                    } hover:bg-[#e6f0fa]` +
                    (editId === c.id ? " ring-2 ring-[#0f6cbd] ring-inset" : "")
                  }
                >
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {c.email}
                  </td>
                  <td className="py-3 px-4">
                    {editId === c.id ? (
                      <select
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]"
                        value={editRole}
                        onChange={(e) =>
                          setEditRole(e.target.value as "editor" | "viewer")
                        }
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          c.access === "editor"
                            ? "bg-[#e6f0fa] text-[#0f6cbd]"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {c.access.charAt(0).toUpperCase() + c.access.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-2 justify-center items-center">
                    {editId === c.id ? (
                      <>
                        <button
                          className="bg-[#0f6cbd] text-white px-3 py-1 rounded hover:bg-[#155a8a] text-xs font-semibold shadow-sm"
                          title="Save"
                          onClick={() => saveEdit(c.id)}
                        >
                          ✓
                        </button>
                        <button
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-semibold shadow-sm"
                          title="Cancel"
                          onClick={() => setEditId(null)}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold hover:bg-[#e6f0fa] shadow-sm"
                          title="Edit"
                          onClick={() => startEdit(c.id, c.access)}
                        >
                          ✎
                        </button>
                        <button
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200 shadow-sm"
                          title="Remove"
                          onClick={() => handleRemoveCollaborator(c.id)}
                        >
                          🗑
                        </button>
                      </>
                    )}
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
