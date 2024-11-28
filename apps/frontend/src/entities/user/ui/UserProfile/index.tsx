type UserProfileProps = {
  nickname: string;
};

export function UserProfile({ nickname }: UserProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md border-2 border-neutral-500"></div>
      <div>{nickname}</div>
    </div>
  );
}
