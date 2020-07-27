import { Context } from '@nuxt/types';
import { App } from '~~/types';
import { convertEpisodeDetail } from '~/scripts/converter/convertEpisodeDetail';

export const getEpisodeInfo = async (
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
