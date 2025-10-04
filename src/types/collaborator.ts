export interface Collaborator {
  id: string;
  name: string;
  email: string;
  access: "editor" | "viewer" | "admin";
  joinedAt: Date;
  isActive?: boolean;
}
