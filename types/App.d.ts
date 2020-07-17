import { Swatch } from 'node-vibrant/lib/color';
import { RawLocation } from 'vue-router';

import { SpotifyAPI } from '~~/types';

export namespace App {
  export type DominantColorInfo = {
    hex: Swatch['hex']
    rgb: Swatch['rgb']
  }

  // TrackTable, TrackList component
  export type TrackDetail = {
    index: number
    id: SpotifyAPI.SimpleTrack['id']
    name: SpotifyAPI.SimpleTrack['name']
    uri: SpotifyAPI.SimpleTrack['uri']
    trackNumber: SpotifyAPI.SimpleTrack['track_number']
    discNumber: SpotifyAPI.SimpleTrack['disc_number']
    hash: string
    artistList: SimpleArtistInfo[]
    featuredArtistList: SimpleArtistInfo[]
    explicit: boolean
    isPlayable: boolean
    durationMs: number
    externalIds?: SpotifyAPI.ExternalId
    externalUrls: SpotifyAPI.ExternalUrls
    previewUrl: string
    isSaved: boolean
    releaseId: string
    releaseName: string
    artworkList: SpotifyAPI.Image[]
  }
  // PlaylistTrackTable component
  export type PlaylistTrackDetail = TrackDetail & {
    addedAt: AddedAtInfo
  }

  export type TrackQueueInfo = {
    isSet: boolean
    isPlaying: boolean
    id: string | undefined
    name: string
    uri: string
    releaseId: string
    releaseName: string
    artistList: SimpleArtistInfo[]
    artworkList: SpotifyAPI.Image[]
    durationMs: number | undefined
  }

  // /releases/:releaseId page
  export type ReleaseInfo = {
    releaseType: 'アルバム' | 'シングル' | 'EP' | 'コンピレーション'
    id: string
    name: string
    uri: string
    artistList: App.SimpleArtistInfo[]
    releaseDate: string
    releaseDatePrecision: string
    totalTracks: number
    durationMs: number
    label: string
    artworkList: SpotifyAPI.Image[]
    copyrightList: SpotifyAPI.Copyright[]
    isSaved: boolean
    trackList: App.TrackDetail[]
    externalUrls: SpotifyAPI.ExternalUrls
    genreList: string[]
    isFullTrackList: boolean
    artistReleaseList: {
      id: string
      name: string
      items: ReleaseCardInfo[]
    }[]
  }
  export type ReleaseTrackInfo = {
    trackList: App.TrackDetail[]
    isFullTrackList: boolean
    durationMs: number
  }

  type CardType = 'album' | 'track'
  type ReleaseCardInfoBase<T extends CardType> = {
    type: T
    releaseType: 'album' | 'single' | 'compilation' | 'appears_on'
    releaseId: string // id と同じ場合 (track のカードの場合) もある
    id: string // track または album の id
    name: string // track または album の name
    uri: string // track または album の name
    artists: App.SimpleArtistInfo[]
    artworkSrc: string | undefined
    externalUrls: SpotifyAPI.ExternalUrls
  }
  export type ReleaseCardInfo<T extends CardType = CardType> = ReleaseCardInfoBase<T>
    & (T extends 'album'
      ? { releaseYear: string }
      : { hash: string })

  export type SimpleArtistInfo = {
    name: string
    id: string
  }
  // /artists/:artistId page
  export type ArtistInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string | undefined
    followersText: string | undefined
    genreList: string[]
    externalUrls: SpotifyAPI.ExternalUrls
  }

  export type ArtistCardInfo = {
    id: string
    name: string
    uri: string
    avatarSrc: string | undefined
    externalUrls: SpotifyAPI.ExternalUrls
  }

  // /playlists/:playlistId page
  export type PlaylistInfo = {
    id: string
    name: string
    uri: string
    description: string | null
    isCollaborative: boolean
    artworkSrc: string | undefined
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

  export type PlaylistCardInfo = {
    id: string
    name: string
    uri: string
    description: string | null
    artworkSrc: string | undefined
    externalUrls: SpotifyAPI.ExternalUrls
  }

  export type AddedAtInfo = {
    text: string | undefined
    title: string
    dateTime: string
  }

  export type CategoryInfo = {
    id: string
    name: string
    artworkSrc: string | undefined
  }

  export type ContentItemInfo<T extends SpotifyAPI.SearchType = SpotifyAPI.SearchType> = {
    type: T
    id: string
    releaseId: string
    name: string
    uri: string
    artworkSrc: string | undefined
    artistList?: SimpleArtistInfo[] // type が release と track の時のみ存在
    to: string | RawLocation
  }
}
