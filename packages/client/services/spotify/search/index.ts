import type { Context } from '@nuxt/types';
import { searchItems } from './searchItems';

export const search = (context: Context) => ({
  searchItems: searchItems(context),
});
