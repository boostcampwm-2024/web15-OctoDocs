import { useState } from "react";
import * as Y from "yjs";
import diff from "fast-diff";

import { diffToDelta } from "../lib/utils";

type ReturnTypes = [string, (textNew: string) => void];

export const useYText = (
  ydoc: Y.Doc,
  key: string,
  currentPage: number,
): ReturnTypes => {
  const yText = ydoc.getMap(key).get(`${key}_${currentPage}`) as Y.Text;

  const initialText = yText !== undefined ? yText.toString() : "";
  const [input, setInput] = useState(initialText);

  const setYText = (textNew: string) => {
    if (yText === undefined) return;
    const delta = diffToDelta(diff(input, textNew));
    yText.applyDelta(delta);
  };

  yText.observe(() => {
    if (yText === undefined) return;
    setInput(yText.toString());
  });

  return [input, setYText];
};
