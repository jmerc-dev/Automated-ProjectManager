import { Timestamp } from "firebase/firestore";

export interface Task {
  id: number;
  name: string;
  startDate: Date | Timestamp;
  notes?: string;
  child?: Task[];
  duration: number;
  dependency: string | null;
  milestone: boolean;
  assignedMembers?: string[] | null;
}
