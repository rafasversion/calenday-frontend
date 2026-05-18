export interface EventAttachment {
  id: number;
  url: string;
  type: "image" | "video" | "file";
}

export interface Event {
  id: number;
  author_id: number;
  title: string;
  description?: string;
  date_start: string;
  date_end?: string;
  location?: string;
  color: string;
  recurrence: "none" | "daily" | "weekdays" | "monthly";
  notify_at?: string;
  attachments: EventAttachment[];
}