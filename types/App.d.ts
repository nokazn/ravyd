import { SpotifyAPI } from '~~/types';

export namespace App {
  export type TrackDetail = {
    index: number
    id: SpotifyAPI.SimpleTrack['id']
    name: SpotifyAPI.SimpleTrack['name']
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
  export type PlaylistTrackDetail = {
    index: number
    id: SpotifyAPI.SimpleTrack['id']
    name: SpotifyAPI.SimpleTrack['name']
    uri: SpotifyAPI.SimpleTrack['uri']
    releaseId: string
    releaseName: string
    hash: string
    artistList: {
      name: SpotifyAPI.Artist['name'],
      id: SpotifyAPI.Artist['id'],
    }[]
    explicit: boolean
    isSaved: boolean
    duration: string
    addedAt: AddedAtInfo
  }
  export type TrackQueueInfo = {
    isPlaying: boolean
    id: string | undefined
    name: string
    uri: string
    artistList: {
      id: string
      name: string
    }[]
    releaseName: string
    releaseId: string
    artworkSrc: string
  }

  export type ReleaseCardInfo = {
    type: 'album' | 'track'
    releaseType: 'album' | 'single' | 'compilation' | 'appears_on'
    name: string //  track または album の name
    id: string //  track または album の id
    releaseId: string
    uri: string
    artists: App.SimpleArtistInfo[]
    releaseYear?: string
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
  }
  // /artists/{artist_id}
  export type ArtistInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string
    followersText: string
  }

  export type AddedAtInfo = {
    fromNow: string
    yyyymd: string
    title: string
    overTwoWeeksAgo: boolean
  }

  export type CategoryInfo = {
    id: string
    name: string
    artworkSrc: string
  }

  export type PlaylistCardInfo = {
    id: string
    name: string
    description: string | null
    uri: string
    artworkSrc: string
  }
  export type PlaylistInfo = {
    id: string
    name: string
    description: string | null
    uri: string
    artworkSrc: string
    owner: SpotifyAPI.UserData
    totalTracks: number
    durationMs: number
    isFollowing: boolean | undefined
    followersText: string
  }
}
