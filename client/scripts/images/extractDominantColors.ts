import Vibrant from 'node-vibrant';
// @todo #126
import 'node-vibrant/lib/bundle.worker';
import { Palette } from 'node-vibrant/lib/color';

export const extractDominantColors = (src: string): Promise<Palette> => {
  const handler = Vibrant.Quantizer.WebWorker != null
    ? Vibrant.from(src)
      .useQuantizer(Vibrant.Quantizer.WebWorker)
      .getPalette()
    : Vibrant.from(src)
      .getPalette();

  return handler;
};
