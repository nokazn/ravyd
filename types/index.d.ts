import '@nuxtjs/axios';

export namespace SpotifyAPI {
  export namespace Auth {
    type AuthorizationResponse<K extends 'access_token' | 'url'> = {
      data: {
        [key in K]: string
      }
    }
    type CodeRequestBody = {
      client_id: string;
      response_type: 'code';
      redirect_uri: string;
      state?: string;
      scope: string;
      show_dialog?: string;
    }
    type TokenRequestBody = {
      grant_type: 'authorization_code';
      code: string;
      redirect_uri: string;
      client_id?: string;
      client_secret?: string;
    }
    type RefreshTokenRequestParams = {
      grant_type: 'refresh_token'
      refresh_token: string
    }
    type TokenResponseData = {
      access_token: string;
      token_type: string;
      scope: string;
      expires_in: number;
      refresh_token?: string;
    }
    type UserData = {
      country: string
      display_name: string | null
      email: string
      explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
      }
      external_urls: {
        [key: string]: string
      }
      followers: {
        href: string | null,
        total: number
      }
      href: string
      id: string
      images: Array<{
        height: number | null
        url: string
        width: number | null
      }>
      product: string
      type: string
      uri: string
    }
  }

  export type SimpleAlbum = {
    // artist の album を取得すると├に含まれる値
    album_group?: 'album' | 'single' | 'compilation' | 'appears_on'
    album_type: 'album' | 'single' | 'compilation'
    artists: Artist[]
    available_markets: string[]
    copyrights: Copyright[]
    external_urls: ExternalUrl
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: 'year' | 'month' | 'day'
    restriction: Restriction
    type: 'album'
    uri: string
  }
  export type Album = {
    external_ids: ExternalId
    genres: string[]
    label: string
    popularity: number // 0 ~ 100
    tracks: Paging<SimpleTrack>
    total_tracks: number
  } & Omit<SimpleAlbum, 'album_group'>

  export type SimpleArtist = {
    external_urls: ExternalUrl
    href: string
    id: string
    name: string
    type: 'artist'
    uri: string
  }
  export type Artist = {
    followers: Followers
    genres: string[]
    images: Image[]
    popularity: number
  } & SimpleArtist

  export namespace Browse {
    type NewReleases = Paging<Album>
  }

  export type Context = {
    // @todo
    type: 'artist' | 'playlist' | 'album' | string
    href: string
    external_urls: ExternalUrl
    uri: string
  }

  export type Copyright = {
    text: string
    type: 'C' | 'P'
  }

  export type Device = {
    id: string | null
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: 'Computer' | 'Tablet' | 'Smartphone' | 'Speaker' | 'TV' | 'AVR' | 'STB' | 'AudioDongle' | 'GameConsole' | 'CastVideo' | 'CastAudio' | 'Automobile' | 'Unknown'
    volume_percent: number
  }

  export type Disallow = {
    nterrupting_playback?: boolean
    pausing?: boolean
    resuming?: boolean
    seeking?: boolean
    skipping_next?: boolean
    skipping_prev?: boolean
    toggling_repeat_context?: boolean
    toggling_shuffle?: boolean
    toggling_repeat_track?: boolean
    transferring_playback?: boolean
  }

  export type Episode = {
    audio_preview_url: string | null
    description: string
    duration_ms: number
    explicit: boolean
    external_urls: ExternalUrl
    href: string
    id: string
    images: Image[]
    is_externally_hosted: boolean
    is_playable: boolean
    language: string // deprecated
    languages: string[]
    name: string
    release_date: string
    release_date_precision: 'year' | 'month' | 'day'
    resume_point: ResumePoint
    type: 'episode'
    uri: string
  }

  // @todo
  export type ExternalId = Merge<{
    isrc?: string
    ean?: string
    upc?: string
  }, {
    [k: string]: string
  }>

  // @todo
  export type ExternalUrl = Merge<{
    spotify?: string
  }, {
    [k: string]: string
  }>

  export type Followers = {
    href: string
    total: number
  }

  export type Image = {
    height: number
    url: string
    width: number
  }

  export type LinkedTrack = {
    external_urls: ExternalUrl
    href: string
    id: string
    type: 'track'
    uri: string
  }

  export type Paging<I> = {
    href: string
    items: I[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }

  export type Cursor = {
    after: string
    before?: string
  }

  export type CursorPaging<I> = {
    cursor: Cursor
    href: string
    items: I[]
    limit: number
    next: string | null
    total: number
  }

  export namespace Player {
    type RecentlyPlayed = CursorPaging<{
      context: Context
      played_at: string // timestamp
      track: SimpleTrack
    }>

    type CurrentlyPlaying = {
      actions: {
        disallow?: Disallow
      }
      context: Context | null
      currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown'
      device: Device
      is_playing: boolean
      item: Track | Episode | null
      progress_ms: number | null
      repeat_state: RepeatState
      shuffle_state: 'on' | 'off'
      timestamp: number
    }
  }

  export type RepeatState = 'off' | 'track' | 'context'

  export type Restriction = {
    reason: string
    [k: string]: string
  }

  export type ResumePoint = {
    fully_played: boolean
    resume_position_ms: number
  }

  export type SimpleTrack = {
    // @todo
    album: SimpleAlbum
    artists: SimpleArtist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_urls: ExternalUrl
    href: string
    id: string
    is_playable: boolean
    linked_from: LinkedTrack
    restrictions: Restriction
    name: string
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
  }
  export type Track = SimpleTrack & {
    external_ids: ExternalId
    popularity: string
  }
}

export type ActionMethodMap = {
  [k: string]: (...args: any) => Promise<void> | void
}

export type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>

export type Merge<FirstType, SecondType> = Except<
  FirstType,
  Extract<keyof FirstType, keyof SecondType>
> & SecondType
