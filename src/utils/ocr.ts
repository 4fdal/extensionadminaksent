import Tesseract from 'tesseract.js';

/**
 * Extracts time in HH:MM:SS or HH:MM format from an image using Tesseract OCR.
 * Prioritizes HH:MM:SS format, falls back to HH:MM.
 * @param imageSrc The source path or URL of the image.
 * @returns The extracted time string or null if not found.
 */
export const extractTimeFromImage = async (imageSrc: string): Promise<string | null> => {
  try {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(imageSrc);
    await worker.terminate();
    
    const text = ret.data.text;
    console.log("OCR Detected Text:", text);
    
    // Try HH:MM:SS first (more specific)
    const timeWithSecondsRegex = /\b([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)\b/g;
    const fullMatches = [...text.matchAll(timeWithSecondsRegex)];
    if (fullMatches.length > 0) {
      const m = fullMatches[0];
      const hh = m[1].padStart(2, '0');
      return `${hh}:${m[2]}:${m[3]}`;
    }
    
    // Fallback: try HH:MM (without seconds)
    const timeWithoutSecondsRegex = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
    const shortMatches = [...text.matchAll(timeWithoutSecondsRegex)];
    if (shortMatches.length > 0) {
      const m = shortMatches[0];
      const hh = m[1].padStart(2, '0');
      return `${hh}:${m[2]}`;
    }
    
    return null;
  } catch (error) {
    console.error("Error during OCR processing:", error);
    return null;
  }
};
