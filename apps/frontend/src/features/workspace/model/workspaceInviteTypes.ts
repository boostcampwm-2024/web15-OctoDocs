export interface WorkspaceInviteLinkRequest {
  id: string;
}

export interface WorkspaceInviteLinkResponse {
  message: string;
  inviteUrl: string;
}

export interface ValidateWorkspaceLinkResponse {
  message: string;
}

export interface SetWorkspaceStatusResponse {
  message: string;
}
