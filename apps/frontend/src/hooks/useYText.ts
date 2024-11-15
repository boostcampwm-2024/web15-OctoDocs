import { useState } from "react";
import * as Y from "yjs";
import diff from "fast-diff";

type DiffResult = [number, string][]; // 각 요소는 [연산자, 값] 형태

function diffToDelta(diffResult: DiffResult) {
  return diffResult.map(([op, value]) =>
    op === diff.INSERT
      ? { insert: value }
      : op === diff.EQUAL
        ? { retain: value.length }
        : op === diff.DELETE
          ? { delete: value.length }
          : null,
  );
}

export const useYText = (ydoc: Y.Doc, currentPage: number) => {
  const yText = ydoc.getMap("title").get(`title_${currentPage}`) as Y.Text;

  const [input, setInput] = useState(yText.toString());

  const setYText = (textNew: string) => {
    const delta = diffToDelta(diff(input, textNew));
    yText.applyDelta(delta);
  };

  yText.observe(() => {
    setInput(yText.toString());
  });

  return { input, setYText };
};
