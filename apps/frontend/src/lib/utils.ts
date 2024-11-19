import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
