import { useLogout } from "../../model/useAuth";

export function UserInfo() {
  const logoutMutation = useLogout();

  return <div onClick={() => logoutMutation.mutate()}>로그아웃</div>;
}
