import { db } from "../firebase/config";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { Member } from "../../types/member";

// Create a member (set by id)
export async function createMember(projectId: string, member: Member) {
  try {
    const memberRef = doc(
      db,
      "projects",
      projectId,
      "members",
      String(member.id)
    );
    await setDoc(memberRef, member);
    return memberRef;
  } catch (e) {
    console.error("Error creating member:", e);
    throw e;
  }
}

// Get all members for a project
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

// Update a member
export async function updateMember(
  projectId: string,
  memberId: string,
  data: Partial<Member>
) {
  try {
    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await updateDoc(memberRef, data);
    return memberRef;
  } catch (e) {
    console.error("Error updating member:", e);
    throw e;
  }
}

// Delete a member
export async function deleteMember(projectId: string, memberId: string) {
  try {
    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await deleteDoc(memberRef);
  } catch (e) {
    console.error("Error deleting member:", e);
    throw e;
  }
}

// Real-time listener for members
export function onMembersSnapshot(
  projectId: string,
  callback: (members: Member[]) => void
) {
  const membersCol = collection(db, "projects", projectId, "members");
  return onSnapshot(membersCol, (snapshot: QuerySnapshot<DocumentData>) => {
    const members = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Member)
    );
    callback(members);
  });
}

export async function getAllMember() {}
