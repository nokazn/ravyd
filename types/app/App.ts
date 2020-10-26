import { Swatch } from 'node-vibrant/lib/color';
import { RawLocation } from 'vue-router';

import { SpotifyAPI } from '~~/types';

export namespace App {
  export type DominantColor = {
    hex: Swatch['hex']
    rgb: Swatch['rgb']
  }

  export type MinimumArtist = {
    name: string
    id: string
    uri: string
  }

  export type AddedAt = {
    text: string | undefined
    title: string
    dateTime: string
  }

  /**
   * Component
   */

  // TrackTable, TrackList component
  export type SimpleTrackDetail = {
    id: SpotifyAPI.SimpleTrack['id']
    name: SpotifyAPI.SimpleTrack['name']
    uri: SpotifyAPI.SimpleTrack['uri']
    artists: App.MinimumArtist[]
    durationMs: number
    externalUrls: SpotifyAPI.ExternalUrls
    isSaved: boolean
    releaseId: string
    releaseName: string
    images: SpotifyAPI.Image[]
    linkedFrom: SpotifyAPI.LinkedTrack | undefined
  }
  export type TrackDetail = SimpleTrackDetail & {
    index: number
    trackNumber: SpotifyAPI.SimpleTrack['track_number']
    discNumber: SpotifyAPI.SimpleTrack['disc_number']
    featuredArtists: App.MinimumArtist[]
    explicit: boolean
    isPlayable: boolean
    externalIds?: SpotifyAPI.ExternalId
    previewUrl: string
  }

  // PlaylistTrackTable component
  export type PlaylistTrackDetail = TrackDetail & {
    type: 'track' | 'episode'
    addedAt?: AddedAt
    addedBy?: SpotifyAPI.UserData
  }

  // TrackQueueMenu component
  export type TrackQueue = {
    isSet: boolean
    isPlaying: boolean
    index: number
    type: Spotify.Track['type']
    id: string | undefined
    name: string
    uri: string
    releaseId: string
    releaseName: string
    artists: App.MinimumArtist[]
    images: SpotifyAPI.Image[]
    linkedFrom: SpotifyAPI.LinkedTrack | undefined
    durationMs: number | undefined
  }

  // EpisodeTable component
  export type EpisodeDetail = {
    index: number
    id: string
    name: string
    uri: string
    description: string
    images: SpotifyAPI.Image[]
    isPlayable: boolean
    explicit: boolean
    releaseDate: string
    releaseDatePrecision: SpotifyAPI.Episode['release_date_precision']
    durationMs: number
    resumePoint: SpotifyAPI.ResumePoint
    externalUrls: SpotifyAPI.ExternalUrls
    previewUrl: string | null
    showId: string
    showName: string
  }

  // DeviceSelectMenu component
  export type Device = {
    id: string | undefined
    type: SpotifyAPI.Device['type']
    isActive: boolean
    disabled: boolean
    title: string
    subtitle: string
  }

  // ContentListItem component
  export type ContentItemTypes = {
    track: SpotifyAPI.Track
    album: SpotifyAPI.SimpleAlbum
    artist: SpotifyAPI.Artist
    playlist: SpotifyAPI.SimplePlaylist
    show: SpotifyAPI.SimpleShow
    episode: SpotifyAPI.SimpleEpisode
  }
  export type ContentItemType = keyof ContentItemTypes
  export type ContentItem<T extends ContentItemType = ContentItemType> = {
    type: T
    id: string
    releaseId: string
    name: string
    uri: string
    externalUrls: SpotifyAPI.ExternalUrls
    images: SpotifyAPI.Image[]
    to: RawLocation
    artists?: SpotifyAPI.SimpleArtist[] // type が release と track の時のみ存在
    linkedFrom?: SpotifyAPI.LinkedTrack | undefined
  }

  /**
   * Card component
   */

  type _ReleaseCardType = 'album' | 'track'
  type _ReleaseCardBase<T extends _ReleaseCardType> = {
    type: T
    releaseId: string // id と同じ場合 (track のカードの場合) もある
    id: string // track または album の id
    name: string // track または album の name
    uri: string // track または album の name
    artists: App.MinimumArtist[]
    images: SpotifyAPI.Image[]
    externalUrls: SpotifyAPI.ExternalUrls
  }
  export type ReleaseCard<T extends _ReleaseCardType = _ReleaseCardType> = T extends 'album'
    ? _ReleaseCardBase<T> & { releaseYear: string }
    : _ReleaseCardBase<T> & { linkedFrom: SpotifyAPI.LinkedTrack | undefined }

  /**
   * Page
   */

   // /releases/:releaseId page
  export type ReleasePage = {
    releaseType: 'アルバム' | 'シングル' | 'EP' | 'コンピレーション'
    id: string;
    name: string;
    uri: string;
    artists: SpotifyAPI.Artist[];
    releaseDate: string;
    releaseDatePrecision: string;
    totalTracks: number;
    durationMs: number;
    label: string;
    images: SpotifyAPI.Image[];
    copyrightList: SpotifyAPI.Copyright[];
    isSaved: boolean;
    trackList: App.TrackDetail[];
    externalUrls: SpotifyAPI.ExternalUrls;
    genreList: string[];
    hasNextTrack: boolean;
    hasPreviousTrack: boolean;
    artistReleaseList: (MinimumArtist & { items: ReleaseCard<'album'>[] })[];
  }

  // /artists/:artistId page
  export type ArtistPage = {
    name: string;
    id: string;
    uri: string;
    images: SpotifyAPI.Image[];
    followersText: string | undefined;
    genreList: string[];
    externalUrls: SpotifyAPI.ExternalUrls;
  }

  // /playlists/:playlistId page
  export type PlaylistPage = {
    id: string
    name: string
    uri: string
    description: string | null
    isCollaborative: boolean
    images: SpotifyAPI.Image[]
    owner: SpotifyAPI.UserData
    durationMs: number
    totalTracks: number
    isPublic: boolean | null
    isOwnPlaylist: boolean
    followersText: string | undefined
    externalUrls: SpotifyAPI.ExternalUrls
    trackUriList: string[]
  }
  // track から null を排除
  export type FilteredPlaylistTrack = SpotifyAPI.PlaylistTrack & {
    track: SpotifyAPI.Track
  }

  // /shows/:showId page
  export type ShowPage = {
    id: string
    name: string
    uri: string
    publisher: string
    images: SpotifyAPI.Image[]
    totalEpisodes: number
    externalUrls: SpotifyAPI.ExternalUrls
    explicit: boolean
    description: string
    copyrightList: SpotifyAPI.Copyright[]
    episodeList: EpisodeDetail[]
    hasNextEpisode: boolean
    hasPreviousEpisode: boolean
  }

  // /users/:userId page
  export type UserPage = {
    displayName: string | null
    externalUrls: SpotifyAPI.ExternalUrls
    followersText: string | undefined
    href: string
    id: string
    images: SpotifyAPI.Image[]
    type: 'user'
    uri: string
  }
}
