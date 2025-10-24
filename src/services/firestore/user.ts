import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function getUserById(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as any) };
  } else {
    return null;
  }
}
