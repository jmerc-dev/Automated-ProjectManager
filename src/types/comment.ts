export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  authorId?: string;
  authorName: string;
}
