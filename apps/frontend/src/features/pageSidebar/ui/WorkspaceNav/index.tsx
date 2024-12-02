interface WorkspaceNavProps {
  workspaceTitle: string;
}

export function WorkspaceNav({ workspaceTitle }: WorkspaceNavProps) {
  // 빌드 에러 해결을 위한 임시 코드.
  console.log(workspaceTitle);
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <h1 className="text-md font-semibold">{"환영합니다 👋🏻"}</h1>
    </div>
  );
}
