import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function getUserById(userId: string) {
  console.log("Fetching user with ID:", userId);
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as any) };
  } else {
    return null;
  }
}
