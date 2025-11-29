import JSZip from 'jszip';
import type { RawFile } from './graphTypes';

const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue'];

const hasAllowedExtension = (filename: string): boolean =>
  ALLOWED_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext));

export const loadRawFilesFromZip = async (file: File): Promise<RawFile[]> => {
  const zip = new JSZip();

  let parsed;
  try {
    // Parse the uploaded zip in the browser.
    parsed = await zip.loadAsync(file);
  } catch (err) {
    throw new Error('Failed to parse zip file');
  }

  const results: RawFile[] = [];
  // Iterate over all entries and collect allowed source files.
  await Promise.all(
    Object.values(parsed.files).map(async (entry) => {
      if (entry.dir) return;
      if (!hasAllowedExtension(entry.name)) return;

      const content = await entry.async('string');
      results.push({
        path: entry.name,
        content,
      });
    })
  );

  return results;
};
