import { create } from "zustand";
import * as Y from "yjs";

interface YDocStore {
  ydoc: Y.Doc;
  setYDoc: (ydoc: Y.Doc) => void;
}

const useYDocStore = create<YDocStore>((set) => ({
  ydoc: new Y.Doc(),
  setYDoc: (ydoc: Y.Doc) => set({ ydoc }),
}));

export default useYDocStore;
