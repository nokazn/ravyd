import { Getters } from 'vuex';
import dayjs from 'dayjs';
import { PlayerState } from './state';
import { hasProp } from '@/utils/hasProp';
import { SpotifyAPI } from '@/types';

export type PlayerGetters = {
  currentTrack: {
    artWorkSrc: string | null
    trackName: string
    trackId: string
    artists: {
      name: string
      id: string
    }[] | null
    duration: string
    progress: string
  } | null
}

export type RootGetters = {
  ['player/currentTrack']: PlayerGetters['currentTrack']
}

const getters: Getters<PlayerState, PlayerGetters> = {
  currentTrack(state) {
    const currentTrack = state.currentlyPlaying?.item;
    if (state.currentlyPlaying != null && currentTrack != null) {
      const artWorkSrc = hasProp(currentTrack, 'album')
        ? (currentTrack as SpotifyAPI.Track).album.images[0]?.url ?? null
        : null;
      const artists = hasProp(currentTrack, 'artists')
        ? (currentTrack as SpotifyAPI.Track).artists
        : null;
      return {
        artWorkSrc,
        trackName: currentTrack.name,
        trackId: currentTrack.id,
        artists: artists?.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })) ?? null,
        duration: dayjs(currentTrack.duration_ms).format('m:ss'),
        progress: state.currentlyPlaying.progress_ms != null
          ? dayjs(state.currentlyPlaying.progress_ms).format('m:ss')
          : '0:00',
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
      duration: dayjs(recentTrack.duration_ms).format('m:ss'),
      progress: '0:00',
    };
  },
};

export default getters;
