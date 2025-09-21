import { Timestamp } from "firebase/firestore";

export interface Task {
  id: number;
  name: string;
  startDate: Date | Timestamp;
  notes?: string;
  progress: number;
  duration: number;
  parentId?: string;
  dependency: string | null;
  assignedMembers?: string[] | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
