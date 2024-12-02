import { User } from "@/entities/user";
import { cn } from "@/shared/lib";

interface ActiveUserProps {
  users: User[];
  className?: string;
}

export function ActiveUser({ users, className }: ActiveUserProps) {
  const maxVisibleUsers = 10;
  const hasMoreUsers = users.length > maxVisibleUsers;
  const visibleUsers = users.slice(0, maxVisibleUsers);

  return (
    <div className={cn("flex items-center", className)}>
      {visibleUsers.map((user, index) => (
        <div
          style={{ backgroundColor: user.color }}
          className={cn(
            "group relative h-5 w-5 rounded-full",
            index !== 0 && "-ml-2",
            "hover:z-10",
          )}
          key={user.clientId}
        >
          <div
            style={{ backgroundColor: user.color }}
            className="absolute left-5 top-0 z-20 hidden max-w-28 truncate rounded-md px-2 py-1 text-sm text-white group-hover:block"
          >
            {user.clientId}
          </div>
        </div>
      ))}
      {hasMoreUsers && (
        <div className="relative -ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
          +{users.length - maxVisibleUsers}
        </div>
      )}
    </div>
  );
}
