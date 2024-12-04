interface WorkspaceNavProps {
  title: string;
}

export function WorkspaceNav({ title }: WorkspaceNavProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <h1 className="text-md font-semibold">{title}</h1>
    </div>
  );
}
