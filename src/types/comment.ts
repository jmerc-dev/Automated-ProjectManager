export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  authorId?: string;
  authorName: string;
}
