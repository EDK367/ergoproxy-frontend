export interface CreateNoteDTO {
  title: string;
  content: string;
  important: boolean;
}

export interface UpdateNoteDTO {
  title: string;
  content: string;
  important: boolean;
}

export interface ShareNoteDTO {
  idFriend: string;
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  important: boolean;
  idFriend: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  isShared: boolean;
}

export interface SharedNoteResponse {
  id: number;
  noteId: string;
  noteTitle: string;
  noteOwnerIdFriend: string;
  noteOwnerUsername: string;
  userSharedIdFriend: string;
  userSharedUsername: string;
  createdAt: string;
  enabled: boolean;
}
