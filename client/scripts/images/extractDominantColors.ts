import Vibrant from 'node-vibrant';

export const extractDominantColors = (src: string) => Vibrant.from(src).getPalette();
