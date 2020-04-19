import '@nuxtjs/axios';

export namespace Spotify {
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
    alubm_group?: 'album' | 'single' | 'compilation'
    alubm_type: 'album' | 'single' | 'compilation'
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
    tracks: Track[]
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

  export type Cursor = {
    before?: string
    after: string
  }

  // @todo
  export type ExternalId = {
    isrc?: string
    ean?: string
    upc?: string
  } & {
    [k: string]: string
  }

  // @todo
  export type ExternalUrl = {
    spotify?: string
  } & {
    [k: string]: string
  }

  export type Followers = {
    href: string
    total: number
  }

  export type Image = {
    height: number
    url: string
    width: number
  }

  export type LinkedTrack ={
    external_urls: ExternalUrl
    href: string
    id: string
    type: 'track'
    uri: string
  }

  export type NewReleases = {
    href: string
    items: Album[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }

  export type Player = {
    RecentlyPlayed: {
      cursor: {
        after: number
        before: number
      }
      href: string
      items: {
        context: Context
        played_at: string // timestamp
        track: SimpleTrack
      }
      limit: number
      next: string
    }
  }

  export type Restriction = {
    reason: string
    [k: string]: string
  }

  export type SimpleTrack = {
    artists: SimpleArtist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_urls: ExternalUrl
    href: string
    id: string
    id_playable: boolean
    linked_from: LinkedTrack
    restrictions: Restriction
    name: string
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
  }
  export type Track = {
    album: SimpleAlbum
    external_ids: ExternalId
    popularity: string
  } & SimpleTrack
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
