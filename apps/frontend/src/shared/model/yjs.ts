import * as Y from "yjs";

export const initializeYText = (
  ymap: Y.Map<unknown>,
  key: string,
  initialData: string,
) => {
  if (!ymap.get(key)) {
    const yText = new Y.Text();
    yText.insert(0, initialData);

    ymap.set(key, yText);
  }
};
