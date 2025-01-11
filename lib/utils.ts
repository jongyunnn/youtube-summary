import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export function decodeHtml(html: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html
    .replaceAll("&amp;#39;", "'")
    .replaceAll("&amp;quot;", '"')
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&");
  return textarea.value;
}
