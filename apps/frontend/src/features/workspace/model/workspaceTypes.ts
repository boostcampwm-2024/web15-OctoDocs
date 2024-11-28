export interface Workspace {
  workspaceId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  role: "owner" | "guest";
  visibility: "private" | "public";
}

export interface CreateWorkSpaceResquest {
  title: string;
  description?: string;
  visibility?: "private" | "public";
  thumbnailUrl?: string;
}

export interface CreateWorkSpaceResponse {
  message: string;
  workspaceId: string;
}

export interface RemoveWorkSpaceResponse {
  message: string;
}

export interface GetUserWorkspaceResponse {
  message: string;
  workspaces: Workspace[];
}
