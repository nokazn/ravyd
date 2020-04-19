import { Getters } from 'vuex';
import { PlayerState } from './state';
import { hasProp } from '@/utils/hasProp';
import { Spotify } from '@/types';

export type PlayerGetters = {
  currentTrack: {
    artWorkSrc: string | null
    trackName: string
    trackId: string
    artists: {
      name: string
      id: string
    }[] | null
  } | null
}

export type RootGetters = {
  ['player/currentTrack']: PlayerGetters['currentTrack']
}

const getters: Getters<PlayerState, PlayerGetters> = {
  currentTrack(state) {
    const currentTrack = state.currentlyPlaying?.item;
    if (currentTrack != null) {
      const artWorkSrc = hasProp(currentTrack, 'album')
        ? (currentTrack as Spotify.Track).album.images[0]?.url ?? null
        : null;
      const artists = hasProp(currentTrack, 'artists')
        ? (currentTrack as Spotify.Track).artists
        : null;
      return {
        artWorkSrc,
        trackName: currentTrack.name,
        trackId: currentTrack.id,
        artists: artists?.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })) ?? null,
      };
    }

    if (state.recentlyPlayed == null) return null;

    const recentTrack = state.recentlyPlayed.items[0].track;
    return {
      artWorkSrc: recentTrack.album.images[0]?.url ?? null,
      trackName: recentTrack.name,
      trackId: recentTrack.id,
      artists: recentTrack.album.artists.map((artist) => ({
        name: artist.name,
        id: artist.id,
      })),
    };
  },
};

export default getters;
