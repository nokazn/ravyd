import type { Context } from '@nuxt/types';
import { getTracks } from './getTracks';

export const tracks = (context: Context) => ({
  getTracks: getTracks(context),
});
