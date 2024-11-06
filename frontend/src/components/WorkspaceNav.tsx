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
      <div className="h-5 w-5 overflow-clip rounded-md">
        <img src={imageUrl} />
      </div>
      <h1 className="text-md font-semibold">{workspaceTitle}</h1>
    </div>
  );
}
