import { create } from "zustand";

interface PageStore {
  currentPage: number | null;
  setCurrentPage: (currentPage: number) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: null,
  setCurrentPage: (currentPage: number) => set({ currentPage }),
}));

export default usePageStore;
