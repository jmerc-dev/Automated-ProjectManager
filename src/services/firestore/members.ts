import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { Member } from "../../types/member";
import type { GanttMember } from "../../types/member";

const membersCollection = (projectId: string) =>
  collection(db, `projects/${projectId}/members`);

export async function addMember(
  projectId: string,
  member: Omit<Member, "id">
): Promise<string> {
  try {
    const memberRef = membersCollection(projectId);
    const docRef = await addDoc(memberRef, { ...member, unit: 100 });
    updateProjectMembersField(projectId, "add", member.emailAddress);
    return docRef.id;
  } catch (e) {
    console.error("Error creating member:", e);
    throw e;
  }
}

async function updateProjectMembersField(
  projectId: string,
  method: "add" | "remove" | "update",
  newMemberEmailAddress: string,
  oldMemberEmailAddress?: string
) {
  try {
    if (method === "update") {
      console.log(
        "Updating member email from",
        oldMemberEmailAddress,
        "to",
        newMemberEmailAddress
      );
      if (!oldMemberEmailAddress || !newMemberEmailAddress) {
        throw new Error(
          "Both old and new member email addresses must be provided for updates."
        );
      }

      updateDoc(doc(db, "projects", projectId), {
        members: arrayRemove(oldMemberEmailAddress),
      }).then(() => {
        updateDoc(doc(db, "projects", projectId), {
          members: arrayUnion(newMemberEmailAddress),
          updatedAt: new Date(),
        });
      });

      console.log("Project members updated successfully");
      return;
    } else {
      updateDoc(doc(db, "projects", projectId), {
        members:
          method === "add"
            ? arrayUnion(newMemberEmailAddress)
            : arrayRemove(oldMemberEmailAddress),
        updatedAt: new Date(),
      });
    }
  } catch (e) {
    console.error("Error updating project members:", e);
    throw e;
  }
}

export async function getMemberByEmail(
  projectId: string,
  emailAddress: string
): Promise<Member | null> {
  try {
    const membersCol = collection(db, "projects", projectId, "members");
    const snapshot = await getDocs(membersCol);
    const member = snapshot.docs.find(
      (doc) => doc.data().emailAddress === emailAddress
    );
    return member ? ({ id: member.id, ...member.data() } as Member) : null;
  } catch (e) {
    console.error("Error fetching member by email:", e);
    throw e;
  }
}

export async function getAllMembers(projectId: string): Promise<Member[]> {
  try {
    const membersCol = collection(db, "projects", projectId, "members");
    const snapshot = await getDocs(membersCol);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Member)
    );
  } catch (e) {
    console.error("Error fetching members:", e);
    throw e;
  }
}

export async function updateMember(
  projectId: string,
  memberId: string,
  data: Partial<Member>,
  oldEmailAddress?: string
) {
  try {
    if (!oldEmailAddress) {
      throw new Error("Old email address is required for updating member.");
    }

    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await updateDoc(memberRef, data);
    updateProjectMembersField(
      projectId,
      "update",
      data.emailAddress!,
      oldEmailAddress
    );
    return memberRef;
  } catch (e) {
    console.error("Error updating member:", e);
    throw e;
  }
}

export async function deleteMember(
  projectId: string,
  memberId: string,
  memberEmail: string
) {
  try {
    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await deleteDoc(memberRef);
    updateProjectMembersField(projectId, "remove", "", memberEmail);
  } catch (e) {
    console.error("Error deleting member:", e);
    throw e;
  }
}

export function listenToProjectMembers(
  projectId: string,
  callback: (members: Member[]) => void,
  loadedCallback?: (loaded: boolean) => void
) {
  const membersCol = collection(db, "projects", projectId, "members");
  return onSnapshot(membersCol, (snapshot: QuerySnapshot<DocumentData>) => {
    const members = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data(), unit: 100 } as Member)
    );
    callback(members);

    if (loadedCallback) loadedCallback(true);
  });
}

export function getProjectMemberByEmail(
  projectId: string,
  emailAddress: string
) {
  const membersCol = collection(db, "projects", projectId, "members");
  return getDocs(membersCol).then((snapshot) => {
    const member = snapshot.docs.find(
      (doc) => doc.data().emailAddress === emailAddress
    );
    return member ? ({ id: member.id, ...member.data() } as Member) : null;
  });
}

export function onGanttMembersSnapshot(
  projectId: string,
  callback: (members: GanttMember[]) => void,
  loadedCallback?: (loaded: boolean) => void
) {
  const membersCol = collection(db, "projects", projectId, "members");
  return onSnapshot(membersCol, (snapshot: QuerySnapshot<DocumentData>) => {
    const members = snapshot.docs.map((doc) => {
      const memberData = { ...doc.data(), id: doc.id } as Member;

      const ganttFormattedMember: GanttMember = {
        id: memberData.id,
        name: memberData.name,
        unit: memberData.unit || 100,
        role: memberData.role,
        teamName: memberData.teamName,
      };

      return ganttFormattedMember;
    });
    callback(members);
    if (loadedCallback) loadedCallback(true);
  });
}
