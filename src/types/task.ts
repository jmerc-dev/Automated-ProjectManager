export interface Task {
  id: number;
  name: string;
  startDate: Date;
  duration: number;
  assignedMembers: string[];
}
