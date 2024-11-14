import { create } from "zustand";

interface PageStore {
  currentPage: number | null;
  isPanelOpen: boolean;
  setCurrentPage: (currentPage: number | null) => void;
  togglePanel: () => void;
  setIsPanelOpen: (isOpen: boolean) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: null,
  isPanelOpen: true,
  setCurrentPage: (currentPage: number | null) =>
    set((state) => ({
      currentPage,
      isPanelOpen:
        currentPage === state.currentPage
          ? !state.isPanelOpen
          : currentPage !== null,
    })),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setIsPanelOpen: (isPanelOpen: boolean) => set({ isPanelOpen }),
}));

export default usePageStore;
