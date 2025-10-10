import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import type { Team } from "../../types/team";
import type { DocumentData } from "firebase/firestore";

const getTeamsCollection = (projectId: string) =>
  collection(db, `projects/${projectId}/teams`);

export async function addTeam(
  projectId: string,
  name: string
): Promise<string> {
  try {
    const memberRef = getTeamsCollection(projectId);
    const docRef = await addDoc(memberRef, { name: name });
    return docRef.id;
  } catch (e) {
    console.error("Error creating team:", e);
    throw e;
  }
}

// listen to teams collection changes
export function onTeamsSnapshot(
  projectId: string,
  callback: (teams: Team[]) => void
) {
  const teamsRef = getTeamsCollection(projectId);
  return onSnapshot(teamsRef, (snapshot: QuerySnapshot<DocumentData>) => {
    const teams = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Team[];
    callback(teams);
  });
}

export function deleteTeam(projectId: string, teamId: string): Promise<void> {
  const teamRef = doc(db, `projects/${projectId}/teams/${teamId}`);
  return deleteDoc(teamRef);
}

export function updateTeam(
  projectId: string,
  teamId: string,
  data: Partial<Team>
): Promise<void> {
  const teamRef = doc(db, `projects/${projectId}/teams/${teamId}`);
  return updateDoc(teamRef, data);
}
