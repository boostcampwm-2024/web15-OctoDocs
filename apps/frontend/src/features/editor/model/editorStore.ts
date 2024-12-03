import { create } from "zustand";

interface EditorStore {
  isPanelOpen: boolean;
  isMaximized: boolean;
  togglePanel: () => void;
  toggleMaximized: () => void;
  setIsPanelOpen: (isOpen: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isPanelOpen: true,
  isMaximized: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),
  setIsPanelOpen: (isPanelOpen: boolean) => set({ isPanelOpen }),
}));
