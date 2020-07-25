import { Context } from '@nuxt/types';
import { App } from '~~/types';
import { convertEpisodeDetail } from '~/scripts/converter/convertEpisodeDetail';

export const getShowInfo = async (
  { app, params }: Context,
): Promise<App.ShowInfo | undefined> => {
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
    images: artworkList,
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

  const isFullEpisodeList = episodes.next == null;

  return {
    id,
    name,
    uri,
    publisher,
    artworkList,
    totalEpisodes,
    externalUrls,
    explicit,
    description,
    episodeList,
    copyrightList,
    isFullEpisodeList,
  };
};
