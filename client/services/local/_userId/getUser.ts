import { Context } from '@nuxt/types';
import { App } from '~~/types';

export const getUser = async (
  { app, params }: Context,
): Promise<App.UserPage | undefined> => {
  const user = await app.$spotify.users.getUserProfile({
    userId: params.userId,
  });
  if (user == null) return undefined;

  const {
    display_name: displayName,
    external_urls: externalUrls,
    followers,
    href,
    id,
    images,
    type,
    uri,
  } = user;

  return {
    displayName,
    externalUrls,
    followers,
    href,
    id,
    images,
    type,
    uri,
  };
};
