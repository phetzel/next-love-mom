import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClerkImageUrl(
  baseUrl: string,
  {
    width = 64,
    height = 64,
    fit = "crop",
    quality = 100,
  }: {
    width?: number;
    height?: number;
    fit?: "scale-down" | "crop";
    quality?: number;
  } = {}
): string {
  return `${baseUrl}?width=${width}&height=${height}&fit=${fit}&quality=${quality}`;
}
