import { useEffect } from "react";

import { useUserStore, type User } from "./userStore";
import { usePageStore } from "@/entities/page";
import { useUserConnection } from "./useUserConnection";
import useConnectionStore from "@/shared/model/useConnectionStore";

export const useSyncedUsers = () => {
  const { currentPage } = usePageStore();
  useUserConnection();
  const { user } = useConnectionStore();
  const { currentUser, setCurrentUser, setUsers } = useUserStore();

  const updateUsersFromAwareness = () => {
    if (!user.provider) return;

    const values = Array.from(
      user.provider.awareness.getStates().values(),
    ) as User[];

    setUsers(values);
  };

  const getLocalStorageUser = (): User | null => {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    if (currentPage === null) return;
    if (!user.provider) return;

    const updatedUser: User = {
      ...currentUser,
      currentPageId: currentPage.toString(),
    };

    setCurrentUser(updatedUser);
    user.provider.awareness.setLocalState(updatedUser);
  }, [currentPage, user.provider]);

  useEffect(() => {
    if (!user.provider) return;

    const localStorageUser = getLocalStorageUser();

    if (!localStorageUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      setCurrentUser(localStorageUser);
      user.provider.awareness.setLocalState(localStorageUser);
    }

    updateUsersFromAwareness();

    user.provider.awareness.on("change", updateUsersFromAwareness);

    return () => {
      if (!user.provider) return;
      user.provider.awareness.off("change", updateUsersFromAwareness);
    };
  }, [user.provider]);
};
