import type { ExtractSource } from "../../types";
import { extractTextFromPdf } from "./pdf";
import { extractTextFromDocx } from "./docx";
import { extractTextFromImage } from "./image";

export interface ExtractResult {
  text: string;
  source: ExtractSource;
}

export async function extractFromFile(
  file: File,
  onOcrProgress?: (percent: number) => void,
): Promise<ExtractResult> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const text = await extractTextFromPdf(file);
    return { text, source: "pdf" };
  }

  if (ext === "docx") {
    const text = await extractTextFromDocx(file);
    return { text, source: "docx" };
  }

  // image files
  const text = await extractTextFromImage(file, onOcrProgress);
  return { text, source: "image" };
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function isSupportedFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "docx" || file.type.startsWith("image/");
}
