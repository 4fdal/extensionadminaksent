import Tesseract from 'tesseract.js';

/**
 * Extracts time in HH:MM or HH:MM:SS format from an image using Tesseract OCR.
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
    
    // Match HH:MM:SS or HH:MM formats with optional spaces
    const timeRegex = /\b(?:[01]?\d|2[0-3])\s*:\s*[0-5]\d(?:\s*:\s*[0-5]\d)?\b/;
    const match = text.match(timeRegex);
    
    if (match && match[0]) {
      // Clean up spaces
      let timeString = match[0].replace(/\s/g, '');
      
      // If it only found HH:MM, append :00
      if (timeString.split(':').length === 2) {
        timeString += ':00';
      }
      return timeString;
    }
    return null;
  } catch (error) {
    console.error("Error during OCR processing:", error);
    return null;
  }
};
