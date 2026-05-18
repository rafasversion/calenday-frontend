import type { User } from "./user";

export interface Tag {
  id: number;
  author_id: number;
  name: string;
  color: string;
  author?: User;
}