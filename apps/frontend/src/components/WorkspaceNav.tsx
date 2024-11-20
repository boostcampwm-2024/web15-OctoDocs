interface WorkspaceNavProps {
  workspaceTitle: string;
}

export default function WorkspaceNav({ workspaceTitle }: WorkspaceNavProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <h1 className="text-md font-semibold">{workspaceTitle}</h1>
    </div>
  );
}
