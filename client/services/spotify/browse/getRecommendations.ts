import { Context } from '@nuxt/types';
import { OneToHundred, SpotifyAPI } from '~~/types';


export const getRecommendations = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    market,
    artistIdList,
    genreList,
    trackIdList,
    ...seedParams
  }: {
    limit?: OneToHundred
    market?: SpotifyAPI.Country
    artistIdList?: string[]
    genreList?: string[]
    trackIdList?: string[]
  } & {
    [k in SpotifyAPI.Browse.MinTrackAttributes]?: number
  } & {
    [k in SpotifyAPI.Browse.MaxTrackAttributes]?: number
  } & {
    [k in SpotifyAPI.Browse.TargetTrackAttributes]?: number
  }): Promise<Partial<SpotifyAPI.Browse.Recommendations>> => {
    const seed_artists = artistIdList?.join(',');
    const seed_genres = genreList?.join(',');
    const seed_tracks = trackIdList?.join(',');
    const request = app.$spotifyApi.$get('/recommendations', {
      params: {
        limit,
        market,
        seed_artists,
        seed_genres,
        seed_tracks,
        ...seedParams,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    return request;
  };
};
