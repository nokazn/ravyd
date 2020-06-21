import { Swatch } from 'node-vibrant/lib/color';
import { SpotifyAPI } from '~~/types';

export namespace App {
  export type DominantColorInfo = {
    hex: Swatch['hex']
    rgb: Swatch['rgb']
  }

  // @todo
  type TrackDetailBase = {
    index: number
    id: SpotifyAPI.SimpleTrack['id']
    name: SpotifyAPI.SimpleTrack['name']
    uri: SpotifyAPI.SimpleTrack['uri']
    trackNumber: SpotifyAPI.SimpleTrack['track_number']
    discNumber: SpotifyAPI.SimpleTrack['disc_number']
    hash: string
    artistList: SimpleArtistInfo[]
    explicit: boolean
    isPlayable: boolean
    isSaved: boolean
    duration: string
    releaseId: string
    releaseName: string
  }
  // TrackTable, TrackList component
  export type TrackDetail = TrackDetailBase & {
    artworkSrc: string | undefined
  }
  // PlaylistTrackTable component
  export type PlaylistTrackDetail = TrackDetailBase & {
    addedAt: AddedAtInfo
  }

  export type TrackQueueInfo = {
    isPlaying: boolean
    id: string | undefined
    name: string
    uri: string
    releaseName: string
    releaseId: string
    artistList: {
      id: string
      name: string
    }[]
    artworkSrc: string | undefined
    duration: string
  }

  // /releases/:releaseId page
  export type ReleaseInfo = {
    releaseType: 'アルバム' | 'シングル' | 'コンピレーション'
    id: string
    name: string
    uri: string
    artistList: App.SimpleArtistInfo[]
    releaseDate: string
    releaseDatePrecision: string
    totalTracks: number
    durationMs: number
    label: string
    artworkSrc: string | undefined
    copyrightList: SpotifyAPI.Copyright[]
    isSaved: boolean
    trackList: App.TrackDetail[]
    isFullTrackList: boolean
  }
  export type ReleaseTrackInfo = {
    trackList: App.TrackDetail[]
    isFullTrackList: boolean
    durationMs: number
  }

  export type ReleaseCardInfo = {
    type: 'album' | 'track'
    releaseType: 'album' | 'single' | 'compilation' | 'appears_on'
    releaseId: string
    id: string // track または album の id
    name: string // track または album の name
    uri: string // track または album の name
    artists: App.SimpleArtistInfo[]
    hash?: string
    releaseYear?: string
    artworkSrc: string | undefined
  }

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
    followersText: string
  }
  export type ArtistCardInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string | undefined
  }

  // /playlists/:playlistId page
  export type PlaylistInfo = {
    id: string
    name: string
    description: string | null
    uri: string
    owner: SpotifyAPI.UserData
    artworkSrc: string | undefined
    durationMs: number
    totalTracks: number
    isFollowing: boolean | undefined
    isPublic: boolean | null
    followersText: string
  }
  export type PlaylistTrackInfo = {
    trackList: PlaylistTrackDetail[]
    isFullTrackList: boolean
  }
  export type FilteredPlaylistTrack = SpotifyAPI.PlaylistTrack & {
    track: SpotifyAPI.Track
  }
  export type PlaylistCardInfo = {
    id: string
    name: string
    description: string | null
    uri: string
    artworkSrc: string | undefined
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
}
