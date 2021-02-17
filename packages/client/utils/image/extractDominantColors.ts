import Vibrant from 'node-vibrant';
import type { Palette } from 'node-vibrant/lib/color';

export const extractDominantColors = (src: string): Promise<Palette> => {
  const handler = new Vibrant(src, {
    quantizer: Vibrant.Quantizer.WebWorker ?? undefined,
  }).getPalette();

  return handler;
};
