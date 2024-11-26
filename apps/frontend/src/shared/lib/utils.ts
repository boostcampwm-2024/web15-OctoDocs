import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import diff from "fast-diff";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColor() {
  const COLORS = [
    "#7d7b94",
    "#41c76d",
    "#f86e7e",
    "#f6b8b8",
    "#f7d353",
    "#3b5bf7",
    "#59cbf7",
  ] as const;

  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function getRandomHexString(length = 10) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

type DiffResult = [number, string][]; // 각 요소는 [연산자, 값] 형태

export function diffToDelta(diffResult: DiffResult) {
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
