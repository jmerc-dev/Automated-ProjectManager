import { db } from "../firebase/config";
import { setDoc } from "firebase/firestore";
import type { Member } from "../../types/member";

export async function createMember(projectId: string, member: Member) {
  //   try {
  //     const memberRef = doc(db, "projects", projectId, "member", String(newTaskId));
  //     const docRef = await setDoc(collection(db, "projects"), {
  //       ...project,
  //       ownerID: user.uid,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       taskIndex: 0,
  //     });
  //     console.log("created member successfuly: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding member");
  //   }
}
