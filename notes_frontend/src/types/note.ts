export type NoteId = string;

export type Note = {
  id: NoteId;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type NoteDraft = {
  title: string;
  content: string;
  tags: string[];
};

export type NotePatch = Partial<Pick<Note, "title" | "content" | "tags">>;
