import * as Root from '~/store/types';
import * as Auth from '~/store/auth/types';
import * as LibraryTracks from '~/store/library/tracks/types';
import * as LibraryReleases from '~/store/library/releases/types';
import * as LibraryArtists from '~/store/library/artists/types';
import * as LibraryShows from '~/store/library/shows/types';
import * as LibraryHistory from '~/store/library/history/types';
import * as Playback from '~/store/playback/types';
import * as Player from '~/store/player/types';
import * as Playlists from '~/store/playlists/types';
import * as Search from '~/store/search/types';

/**
 * モジュールを追加するごとに変更
 */
declare module 'typed-vuex' {
  type RootState = {
    auth: Auth.AuthState
    library: {
      tracks: LibraryTracks.LibraryTracksState
      releases: LibraryReleases.LibraryReleasesState
      artists: LibraryArtists.LibraryArtistsState
      shows: LibraryShows.LibraryShowsState
      history: LibraryHistory.LibraryHistoryState
    }
    playback: Playback.PlaybackState
    player: Player.PlayerState
    playlists: Playlists.PlaylistsState
    search: Search.SearchState
  } & Root.RootState

  type RootGetters = Root.RootGetters
    & Auth.RootGetters
    & LibraryTracks.RootGetters
    & LibraryReleases.RootGetters
    & LibraryArtists.RootGetters
    & LibraryShows.RootGetters
    & LibraryHistory.RootGetters
    & Playback.RootGetters
    & Player.RootGetters
    & Playlists.RootGetters
    & Search.RootGetters

  type RootMutations = Root.RootMutations
    & Auth.RootMutations
    & LibraryTracks.RootMutations
    & LibraryReleases.RootMutations
    & LibraryArtists.RootMutations
    & LibraryShows.RootMutations
    & LibraryHistory.RootMutations
    & Playback.RootMutations
    & Player.RootMutations
    & Playlists.RootMutations
    & Search.RootMutations

  type RootActions = Root.RootActions
    & Auth.RootActions
    & LibraryTracks.RootActions
    & LibraryReleases.RootActions
    & LibraryArtists.RootActions
    & LibraryShows.RootActions
    & LibraryHistory.RootActions
    & Playback.RootActions
    & Player.RootActions
    & Playlists.RootActions
    & Search.RootActions
}
