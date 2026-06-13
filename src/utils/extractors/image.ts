import Tesseract from "tesseract.js";

export async function extractTextFromImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const result = await Tesseract.recognize(file, "eng", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(m.progress ?? 0);
      }
    },
  });

  return result.data.text.trim();
}
