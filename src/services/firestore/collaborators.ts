import { db } from "../../config/firebase/config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Collaborator } from "../../types/collaborator";

const getCollaboratorsCollection = (projectId: string) =>
  collection(db, `projects/${projectId}/collaborators`);

export async function addCollaborator(
  projectId: string,
  collaborator: Omit<Collaborator, "id">
): Promise<string> {
  const colRef = getCollaboratorsCollection(projectId);
  const docRef = await addDoc(colRef, {
    ...collaborator,
    joinedAt: Timestamp.fromDate(collaborator.joinedAt),
  });
  return docRef.id;
}

export async function updateCollaborator(
  projectId: string,
  id: string,
  data: Partial<Omit<Collaborator, "id">>
) {
  const docRef = doc(db, `projects/${projectId}/collaborators/${id}`);
  let updateData = { ...data };
  if (data.joinedAt && data.joinedAt instanceof Date) {
    // Firestore expects Timestamp, not Date
    (updateData as any).joinedAt = Timestamp.fromDate(data.joinedAt);
  }
  await updateDoc(docRef, updateData);
}

// Remove a collaborator
export async function removeCollaborator(projectId: string, id: string) {
  const docRef = doc(db, `projects/${projectId}/collaborators/${id}`);
  await deleteDoc(docRef);
}

// Get all collaborators for a project
export function listenToCollaborators(
  projectId: string,
  callback: (collaborators: Collaborator[]) => void
) {
  const colRef = getCollaboratorsCollection(projectId);
  return onSnapshot(colRef, (snapshot) => {
    const collaborators = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        access: data.access,
        joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
        isActive: data.isActive ?? true,
      } as Collaborator;
    });
    callback(collaborators);
  });
}

// Get a single collaborator by id
export async function getCollaborator(
  projectId: string,
  id: string
): Promise<Collaborator | null> {
  const docRef = doc(db, `projects/${projectId}/collaborators/${id}`);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    email: data.email,
    access: data.access,
    joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
    isActive: data.isActive ?? true,
  } as Collaborator;
}
