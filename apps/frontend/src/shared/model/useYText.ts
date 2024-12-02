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

  const [input, setInput] = useState(yText.toString());

  const setYText = (textNew: string) => {
    const delta = diffToDelta(diff(input, textNew));
    yText.applyDelta(delta);
  };

  yText.observe(() => {
    setInput(yText.toString());
  });

  return [input, setYText];
};
