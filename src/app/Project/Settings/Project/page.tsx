interface ProjectSpecificSettingsProps {
  projectId: string;
}

import { useState } from "react";
import { deleteProject } from "../../../../services/firestore/projects";
import { useNavigate } from "react-router-dom";

export default function ProjectSpecificSettings({
  projectId,
}: ProjectSpecificSettingsProps) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Placeholder for actual delete logic
  async function handleDelete() {
    if (
      prompt(
        "Are you sure you want to permanently delete this project? This action cannot be undone. Type DELETE to confirm."
      ) === "DELETE"
    ) {
      setDeleting(true);
      // TODO: Call your deleteProject(projectId) function here
      // await deleteProject(projectId);
      deleteProject(projectId);

      setDeleting(false);
      // Optionally redirect or show a message
      navigate("/");
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-[#0f6cbd] mb-6">Project</h2>
      <div className="mt-12 border-t border-gray-400 pt-8">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-gray-700 mb-4">
          Deleting this project is irreversible. All project data will be lost.
        </p>
        <button
          className="bg-[#e53935] hover:bg-[#b71c1c] text-white font-semibold px-4 py-2 rounded-md transition disabled:opacity-60 text-sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Project Permanently"}
        </button>
      </div>
    </div>
  );
}
