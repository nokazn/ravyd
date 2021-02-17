import type { Context } from '@nuxt/types';
import { getCurrentUserProfile } from './getCurrentUserProfile';
import { getUserProfile } from './getUserProfile';

export const users = (context: Context) => ({
  getCurrentUserProfile: getCurrentUserProfile(context),
  getUserProfile: getUserProfile(context),
});
