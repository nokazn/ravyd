import { SpotifyAPI } from '~~/types';

export namespace App {
  export type TrackDetail = {
    index: number
    name: SpotifyAPI.SimpleTrack['name']
    id: SpotifyAPI.SimpleTrack['id']
    uri: SpotifyAPI.SimpleTrack['uri']
    trackNumber: SpotifyAPI.SimpleTrack['track_number']
    discNumber: SpotifyAPI.SimpleTrack['disc_number']
    artists: {
      name: SpotifyAPI.Artist['name'],
      id: SpotifyAPI.Artist['id'],
    }[]
    explicit: boolean
    isSaved: boolean
    duration: string
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
  export type ArtistInfo = {
    name: string
    id: string
    uri: string
    avatarSrc: string
    followersText: string
  }
}
