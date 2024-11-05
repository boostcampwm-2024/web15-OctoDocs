interface WorkspaceNavProps {
  imageUrl: string;
  workspaceTitle: string;
}

export default function WorkspaceNav({
  imageUrl,
  workspaceTitle,
}: WorkspaceNavProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="h-5 w-5 rounded-md">
        <img src={imageUrl} />
      </div>
      <h1 className="text-lg font-bold">{workspaceTitle}</h1>
    </div>
  );
}
