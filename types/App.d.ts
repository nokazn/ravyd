import { SpotifyAPI } from '~~/types';

export namespace App {
  export type TrackDetail = {
    index: number
    name: SpotifyAPI.SimpleTrack['name']
    id: SpotifyAPI.SimpleTrack['id']
    uri: SpotifyAPI.SimpleTrack['uri']
    artworkSrc?: string
    releaseId?: string
    trackNumber: SpotifyAPI.SimpleTrack['track_number']
    discNumber: SpotifyAPI.SimpleTrack['disc_number']
    hash: string
    artistList: {
      name: SpotifyAPI.Artist['name'],
      id: SpotifyAPI.Artist['id'],
    }[]
    explicit: boolean
    isSaved: boolean
    duration: string
  }

  export type ReleaseCardInfo = {
    type: 'album' | 'track'
    releaseType: 'album' | 'single' | 'compilation'
    name: string //  track または album の name
    id: string //  track または album の id
    releaseId: string
    uri: string
    artists: App.SimpleArtistInfo[]
    artworkSrc: string
  }
  // /releases/{release_id}
  export type ReleaseInfo = {
    albumType: 'アルバム' | 'シングル' | 'コンピレーション'
    artistList: App.SimpleArtistInfo[]
    label: string
    name: string
    id: string
    uri: string
    releaseDate: string
    releaseDatePrecision: string
    artworkSrc: string
    trackList: App.TrackDetail[]
    totalTracks: number
    durationMs: number
    copyrightList: SpotifyAPI.Copyright[]
    isSaved: boolean
  }

  export type SimpleArtistInfo = {
    name: string
    id: string
  }
  export type ArtistCardInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string
    width?: number
  }
  // /artists/{artist_id}
  export type ArtistInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string
    followersText: string
  }
}
