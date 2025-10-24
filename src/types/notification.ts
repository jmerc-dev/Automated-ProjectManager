export interface Notification {
  id: string;
  userId: string;
  message: string;
  recipientId: string[];
  readBy: string[];
  createdAt: Date;
}
