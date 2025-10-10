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
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { Member } from "../../types/member";

const getMembersCollection = (projectId: string) =>
  collection(db, `projects/${projectId}/members`);

export async function addMember(
  projectId: string,
  member: Omit<Member, "id">
): Promise<string> {
  try {
    const memberRef = getMembersCollection(projectId);
    const docRef = await addDoc(memberRef, { ...member });
    return docRef.id;
  } catch (e) {
    console.error("Error creating member:", e);
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
  data: Partial<Member>
) {
  try {
    console.log("Updating member:", projectId, memberId, data);
    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await updateDoc(memberRef, data);
    return memberRef;
  } catch (e) {
    console.error("Error updating member:", e);
    throw e;
  }
}

export async function deleteMember(projectId: string, memberId: string) {
  try {
    const memberRef = doc(db, "projects", projectId, "members", memberId);
    await deleteDoc(memberRef);
  } catch (e) {
    console.error("Error deleting member:", e);
    throw e;
  }
}

export function onMembersSnapshot(
  projectId: string,
  callback: (members: Member[]) => void,
  loadedCallback?: (loaded: boolean) => void
) {
  const membersCol = collection(db, "projects", projectId, "members");
  return onSnapshot(membersCol, (snapshot: QuerySnapshot<DocumentData>) => {
    const members = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Member)
    );
    callback(members);

    if (loadedCallback) loadedCallback(true);
  });
}
