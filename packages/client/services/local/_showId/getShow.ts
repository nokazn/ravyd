import type { Context } from '@nuxt/types';
import type { App } from '~/entities';
import { convertEpisodeDetail } from '~/services/converter';

export const getShow = async (
  { app, params }: Context,
): Promise<App.ShowPage | undefined> => {
  const market = app.$getters()['auth/userCountryCode'];
  const show = await app.$spotify.shows.getShow({
    showId: params.showId,
    market,
  });
  if (show == null) return undefined;

  const {
    id,
    name,
    uri,
    publisher,
    images,
    total_episodes: totalEpisodes,
    external_urls: externalUrls,
    explicit,
    description,
    episodes,
    copyrights: copyrightList,
  } = show;

  const episodeList = episodes.items.map(convertEpisodeDetail({
    showId: id,
    showName: name,
  }));

  return {
    id,
    name,
    uri,
    publisher,
    images,
    totalEpisodes,
    externalUrls,
    explicit,
    description,
    episodeList,
    copyrightList,
    hasNextEpisode: episodes.next != null,
    hasPreviousEpisode: episodes.previous != null,
  };
};
