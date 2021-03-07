import type { KeyPrefix } from 'shared/types';
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
    auth: Auth.State
    library: {
      tracks: LibraryTracks.State
      releases: LibraryReleases.State
      artists: LibraryArtists.State
      shows: LibraryShows.State
      history: LibraryHistory.State
    }
    playback: Playback.State
    player: Player.State
    playlists: Playlists.State
    search: Search.State
  } & Root.State

  type RootGetters = Root.Getters
    & KeyPrefix<'auth', Auth.Getters>
    & KeyPrefix<'library/tracks', LibraryTracks.Getters>
    & KeyPrefix<'library/releases', LibraryReleases.Getters>
    & KeyPrefix<'library/artists', LibraryArtists.Getters>
    & KeyPrefix<'library/shows', LibraryShows.Getters>
    & KeyPrefix<'library/history', LibraryHistory.Getters>
    & KeyPrefix<'playback', Playback.Getters>
    & KeyPrefix<'player', Player.Getters>
    & KeyPrefix<'playlists', Playlists.Getters>
    & KeyPrefix<'search', Search.Getters>

  type RootMutations = Root.Mutations
    & KeyPrefix<'auth', Auth.Mutations>
    & KeyPrefix<'library/tracks', LibraryTracks.Mutations>
    & KeyPrefix<'library/releases', LibraryReleases.Mutations>
    & KeyPrefix<'library/artists', LibraryArtists.Mutations>
    & KeyPrefix<'library/shows', LibraryShows.Mutations>
    & KeyPrefix<'library/history', LibraryHistory.Mutations>
    & KeyPrefix<'playback', Playback.Mutations>
    & KeyPrefix<'player', Player.Mutations>
    & KeyPrefix<'playlists', Playlists.Mutations>
    & KeyPrefix<'search', Search.Mutations>

  type RootActions = Root.Actions
    & KeyPrefix<'auth', Auth.Actions>
    & KeyPrefix<'library/tracks', LibraryTracks.Actions>
    & KeyPrefix<'library/releases', LibraryReleases.Actions>
    & KeyPrefix<'library/artists', LibraryArtists.Actions>
    & KeyPrefix<'library/shows', LibraryShows.Actions>
    & KeyPrefix<'library/history', LibraryHistory.Actions>
    & KeyPrefix<'playback', Playback.Actions>
    & KeyPrefix<'player', Player.Actions>
    & KeyPrefix<'playlists', Playlists.Actions>
    & KeyPrefix<'search', Search.Actions>
}
