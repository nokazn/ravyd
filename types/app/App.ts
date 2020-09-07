import { Swatch } from 'node-vibrant/lib/color';
import { RawLocation } from 'vue-router';

import { SpotifyAPI } from '~~/types';

export namespace App {
  export type DominantColorInfo = {
    hex: Swatch['hex']
    rgb: Swatch['rgb']
  }

  export type SimpleArtistInfo = {
    name: string
    id: string
    uri: string
  }

  export type AddedAtInfo = {
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
    artists: App.SimpleArtistInfo[]
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
    featuredArtists: App.SimpleArtistInfo[]
    explicit: boolean
    isPlayable: boolean
    externalIds?: SpotifyAPI.ExternalId
    previewUrl: string
  }

  // PlaylistTrackTable component
  export type PlaylistTrackDetail = TrackDetail & {
    type: 'track' | 'episode'
    addedAt?: AddedAtInfo
    addedBy?: SpotifyAPI.UserData
  }

  // TracuQueueMenu component
  export type TrackQueueInfo = {
    isSet: boolean
    isPlaying: boolean
    index: number
    id: string | undefined
    name: string
    uri: string
    releaseId: string
    releaseName: string
    artists: App.SimpleArtistInfo[]
    images: SpotifyAPI.Image[]
    linkedFrom: SpotifyAPI.LinkedTrack | undefined
    durationMs: number | undefined
  }

  export type DeviceInfo = {
    id: string | undefined
    type: string
    isActive: boolean
    disabled: boolean
    title: string
    subtitle: string
  }

  // ContentListItem component
  export type ContentItems = {
    track: SpotifyAPI.Track
    album: SpotifyAPI.SimpleAlbum
    artist: SpotifyAPI.Artist
    playlist: SpotifyAPI.SimplePlaylist
    show: SpotifyAPI.SimpleShow
    episode: SpotifyAPI.SimpleEpisode
  }
  export type ContentItemType = keyof ContentItems
  export type ContentItemInfo<T extends ContentItemType = ContentItemType> = {
    type: T
    id: string
    releaseId: string
    name: string
    uri: string
    externalUrls: SpotifyAPI.ExternalUrls
    images: SpotifyAPI.Image[]
    to: string | RawLocation
    artists?: SpotifyAPI.SimpleArtist[] // type が release と track の時のみ存在
    linkedFrom?: SpotifyAPI.LinkedTrack | undefined
  }

  /**
   * Card component
   */

  type _ReleaseCardType = 'album' | 'track'
  type _ReleaseCardInfoBase<T extends _ReleaseCardType> = {
    type: T
    releaseId: string // id と同じ場合 (track のカードの場合) もある
    id: string // track または album の id
    name: string // track または album の name
    uri: string // track または album の name
    artists: App.SimpleArtistInfo[]
    images: SpotifyAPI.Image[]
    externalUrls: SpotifyAPI.ExternalUrls
  }
  export type ReleaseCardInfo<T extends _ReleaseCardType = _ReleaseCardType> = T extends 'album'
    ? _ReleaseCardInfoBase<T> & { releaseYear: string }
    : _ReleaseCardInfoBase<T> & { linkedFrom: SpotifyAPI.LinkedTrack | undefined }

  export type ArtistCardInfo = {
    id: string
    name: string
    uri: string
    images: SpotifyAPI.Image[]
    externalUrls: SpotifyAPI.ExternalUrls
  }

  export type PlaylistCardInfo = {
    id: string
    name: string
    uri: string
    description: string | null
    images: SpotifyAPI.Image[]
    externalUrls: SpotifyAPI.ExternalUrls
  }

  export type ShowCardInfo = {
    id: string
    name: string
    uri: string
    publisher: string
    description: string | null
    images: SpotifyAPI.Image[]
    externalUrls: SpotifyAPI.ExternalUrls
  }

  /**
   * Page
   */

   // /releases/:releaseId page
  export type ReleaseInfo = {
    releaseType: 'アルバム' | 'シングル' | 'EP' | 'コンピレーション'
    id: string
    name: string
    uri: string
    artists: SpotifyAPI.Artist[]
    releaseDate: string
    releaseDatePrecision: string
    totalTracks: number
    durationMs: number
    label: string
    images: SpotifyAPI.Image[]
    copyrightList: SpotifyAPI.Copyright[]
    isSaved: boolean
    trackList: App.TrackDetail[]
    externalUrls: SpotifyAPI.ExternalUrls
    genreList: string[]
    isFullTrackList: boolean
    artistReleaseList: (SimpleArtistInfo & { items: ReleaseCardInfo[] })[]
  }

  // /artists/:artistId page
  export type ArtistInfo = {
    name: string
    id: string
    uri: string
    images: SpotifyAPI.Image[]
    followersText: string | undefined
    genreList: string[]
    externalUrls: SpotifyAPI.ExternalUrls
  }

  // /playlists/:playlistId page
  export type PlaylistInfo = {
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
  export type PlaylistTrackInfo = {
    trackList: PlaylistTrackDetail[]
    isFullTrackList: boolean
  }
  // track から null を排除
  export type FilteredPlaylistTrack = SpotifyAPI.PlaylistTrack & {
    track: SpotifyAPI.Track
  }

  // /genres/:genreId page
  export type CategoryInfo = {
    id: string
    name: string
    images: SpotifyAPI.Image[]
  }

  // /shows/:showId page
  export type ShowInfo = {
    id: string
    name: string
    uri: string
    publisher: string
    images: SpotifyAPI.Image[]
    totalEpisodes: number
    externalUrls: SpotifyAPI.ExternalUrls
    explicit: boolean
    description: string
    episodeList: EpisodeDetail[]
    copyrightList: SpotifyAPI.Copyright[]
    isFullEpisodeList: boolean
  }

  // /episodes/:episodeId page
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

  // /users/:userId page
  export type UserInfo = {
    displayName: string | null
    externalUrls: SpotifyAPI.ExternalUrls
    followersText: string | undefined
    href: string
    id: string
    images: SpotifyAPI.Image[]
    type: 'user'
    uri: string
  }
  export type UserPlaylistInfo = {
    playlists: PlaylistCardInfo[]
    hasNext: boolean
    total: number
  }
}
