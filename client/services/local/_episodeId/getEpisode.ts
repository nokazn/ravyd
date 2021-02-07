import type { Context } from '@nuxt/types';
import type { App } from '~/entities';
import { convertEpisodeDetail } from '~/services/converter';

export const getEpisode = async (
  { app, params }: Context,
): Promise<App.EpisodeDetail | undefined> => {
  const market = app.$getters()['auth/userCountryCode'];
  const episode = await app.$spotify.episodes.getEpisode({
    episodeId: params.episodeId,
    market,
  });
  if (episode == null) return undefined;

  return convertEpisodeDetail(undefined)(episode, 0);
};
