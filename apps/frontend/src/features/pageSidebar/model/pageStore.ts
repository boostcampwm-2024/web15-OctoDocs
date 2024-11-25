import { create } from "zustand";

interface PageStore {
  currentPage: number | null;
  isPanelOpen: boolean;
  isMaximized: boolean;
  setCurrentPage: (currentPage: number | null) => void;
  togglePanel: () => void;
  toggleMaximized: () => void;
  setIsPanelOpen: (isOpen: boolean) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  currentPage: null,
  isPanelOpen: true,
  isMaximized: false,
  setCurrentPage: (currentPage: number | null) =>
    set((state) => ({
      currentPage,
      isPanelOpen:
        currentPage === state.currentPage
          ? !state.isPanelOpen
          : currentPage !== null,
    })),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),
  setIsPanelOpen: (isPanelOpen: boolean) => set({ isPanelOpen }),
}));
