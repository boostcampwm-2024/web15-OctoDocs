import { User } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

interface ActiveUserProps {
  users: User[];
  className?: string;
}

export default function ActiveUser({ users, className }: ActiveUserProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {users.map((user) => (
        <div
          style={{ backgroundColor: user.color }}
          className={cn("group relative h-5 w-5 rounded-full")}
          key={user.clientId}
        >
          <div
            style={{ backgroundColor: user.color }}
            className="absolute left-2 z-10 hidden px-2 text-sm group-hover:flex"
          >
            {user.clientId}
          </div>
        </div>
      ))}
    </div>
  );
}
