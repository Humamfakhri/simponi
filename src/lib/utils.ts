import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFirebasePrefix(data: string): string {
  return data.replace(/^Firebase:\s+/i, "");
}