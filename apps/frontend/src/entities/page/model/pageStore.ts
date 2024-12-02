import { create } from "zustand";

interface PageStore {
  currentPage: number | null;
  setCurrentPage: (currentPage: number | null) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  currentPage: null,
  setCurrentPage: (currentPage: number | null) => set({ currentPage }),
}));
