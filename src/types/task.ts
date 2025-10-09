import { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  name: string;
  startDate: Date | Timestamp;
  notes?: string;
  progress: number;
  duration: number;
  parentId?: string;
  dependency: string | null;
  assignedMembers?: string[] | null;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  order: number;
  docId: string;
}

export const CoreTaskFields: any = {
  docId: "docId",
  name: "name",
  duration: "duration",
  startDate: "startDate",
  dependency: "dependency",
  progress: "progress",
  order: "order",
  notes: "notes",
  parentId: "parentId",
  assignedMembers: "assignedMembers",
} as const;

export type CoreTaskFieldsType =
  (typeof CoreTaskFields)[keyof typeof CoreTaskFields];
