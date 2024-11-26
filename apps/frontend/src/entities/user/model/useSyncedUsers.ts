import { useEffect } from "react";

import { User } from "@/entities/user/model/userStore";
import { usePageStore } from "@/features/pageSidebar/model";
import { useUserStore } from "@/entities/user/model";

export const useSyncedUsers = () => {
  const { currentPage } = usePageStore();
  const { provider, currentUser, setCurrentUser, setUsers } = useUserStore();

  const updateUsersFromAwareness = () => {
    const values = Array.from(
      provider.awareness.getStates().values(),
    ) as User[];
    setUsers(values);
  };

  const getLocalStorageUser = (): User | null => {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    if (currentPage === null) return;

    const updatedUser: User = {
      ...currentUser,
      currentPageId: currentPage.toString(),
    };

    setCurrentUser(updatedUser);
    provider.awareness.setLocalState(updatedUser);
  }, [currentPage]);

  useEffect(() => {
    const localStorageUser = getLocalStorageUser();

    if (!localStorageUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      setCurrentUser(localStorageUser);
      provider.awareness.setLocalState(localStorageUser);
    }

    updateUsersFromAwareness();

    provider.awareness.on("change", updateUsersFromAwareness);

    return () => {
      provider.awareness.off("change", updateUsersFromAwareness);
    };
  }, []);
};
