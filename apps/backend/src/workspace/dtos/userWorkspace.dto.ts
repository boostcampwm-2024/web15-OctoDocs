export class UserWorkspaceDto {
  workspaceId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  role: 'owner' | 'guest' | null;
  visibility: 'public' | 'private';
}
