import { create } from "zustand";

interface PageStore {
  currentPage: number | null;
  setCurrentPage: (currentPage: number | null) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: null,
  setCurrentPage: (currentPage: number | null) => set({ currentPage }),
}));

export default usePageStore;
