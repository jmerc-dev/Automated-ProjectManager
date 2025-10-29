import Task from "../components/task";

export interface Notification {
  id: string;
  projectId: string;
  message: string;
  type: NotificationType;
  isMemberSpecific?: boolean; // Whether the notification is targeted to specific roles or members
  targetDepartment?: string[]; // Array of roles the notification is intended for
  targetMembers?: string[]; // Array of email addresses the notification is intended for
  readBy: string[]; // Array of email addresses who have read the notification
  createdAt: Date;
}

export const NotificationType: any = {
  // Used in the codebase
  MemberAdded: "member_added",
  TaskDeleted: "task_deleted",
  TaskAssigned: "task_assigned",
  TaskUpdated: "task_updated",

  // New types to be used
  ProjectCreated: "project_created",
  ProjectUpdated: "project_updated",
  TaskCompleted: "task_completed",
  TaskOverdue: "task_overdue",
  TaskApproved: "task_approved",
  TaskRejected: "task_rejected",
  FeedbackRequested: "feedback_requested",
  DeadlineSoon: "deadline_soon",
  Comment: "comment",
  Mention: "mention",
  Announcement: "announcement",
};

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
