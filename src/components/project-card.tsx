import type { Project } from "../types/project";
import DropdownMenu from "./dropdown";
import leaderIcon from "../assets/images/leader.png";
import memberIcon from "../assets/images/member.png";
import { getUserById } from "../services/firestore/user";
import { useEffect, useState } from "react";
import type { Member } from "../types/member";
import { getMemberByEmail } from "../services/firestore/members";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  onCardClick: () => void | Promise<void>;
  isAssociated?: boolean;
}

export default function ProjectCard({
  project,
  onCardClick,
  isAssociated,
}: ProjectCardProps) {
  const [member, setMember] = useState<Member | null>(null);
  const [ownerName, setOwnerName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOwnerName() {
      if (project.ownerID) {
        const user = await getUserById(project.ownerID);
        setOwnerName(user?.displayName || "");
      }
    }

    async function fetchMember() {
      if (project.members && project.members.length > 0) {
        const memberData = await getMemberByEmail(
          project.id,
          project.members[0]
        );
        setMember(memberData);
      }
    }
    if (isAssociated) {
      fetchOwnerName();
      fetchMember();
    }
  }, [project.ownerID]);

  return (
    <div className="h-full">
      <div
        className="group flex flex-col justify-between h-full w-full border border-gray-200 bg-white rounded-2xl px-7 py-6 transition-all duration-150 cursor-pointer hover:border-[#0f6cbd] hover:bg-[#f7fafd] focus-within:border-[#0f6cbd]"
        tabIndex={0}
        onClick={() => {
          if (!isAssociated) onCardClick();
          else {
            if (member?.level === "Leader") {
              navigate(`/teamtasks/${project.id}`);
            } else if (member?.level === "Member") {
              navigate(`/mytasks/${project.id}`);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onCardClick();
        }}
        role="button"
        aria-label={`Open project ${project.name}`}
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#0f6cbd]">
            {project.name}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Created: {project.createdAt.toLocaleDateString()}
          </div>
          {isAssociated && (
            <div className="flex flex-row justify-between">
              <div className="text-xs text-gray-500 mb-2">
                Owner: {ownerName}
              </div>
              <div className="ml-auto text-sm *:w-5">
                {member?.level === "Leader" && (
                  <img src={leaderIcon} alt="Leader" />
                )}
                {member?.level === "Member" && (
                  <img src={memberIcon} alt="Member" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
