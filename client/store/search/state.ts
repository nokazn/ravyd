import { SpotifyAPI } from '~~/types';

export type SearchState = {
  albums: SpotifyAPI.SimpleAlbum[] | undefined
  artists: SpotifyAPI.Artist[] | undefined
  tracks: SpotifyAPI.Track[] | undefined
  playlists: SpotifyAPI.SimplePlaylist[] | undefined
  shows: SpotifyAPI.SimpleShow[] | undefined
  episodes: SpotifyAPI.SimpleEpisode[] | undefined
}

const state = (): SearchState => ({
  albums: undefined,
  artists: undefined,
  tracks: undefined,
  playlists: undefined,
  shows: undefined,
  episodes: undefined,
});

export default state;
