import { Context } from '@nuxt/types';
import { getCurrentUserProfile } from './getCurrentUserProfile';
import { getUserProfile } from './getUserProfile';

export const user = (context: Context) => ({
  getCurrentUserProfile: getCurrentUserProfile(context),
  getUserProfile: getUserProfile(context),
});
