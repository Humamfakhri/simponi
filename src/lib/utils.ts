import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFirebasePrefix(data: string): string {
  return data.replace(/^Firebase:\s+/i, "");
}

export function floorToOneDecimal(value: number | undefined): number {
  if (value === undefined) return NaN;
  return Math.floor(value * 10) / 10;
}
