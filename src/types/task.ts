import type { Tag } from "./tag";
import type { EventAttachment } from "./event";

export interface Task {
  id: number;
  author_id: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  created_at: string;
  attachments: EventAttachment[];
  task_tags: Tag[];
}