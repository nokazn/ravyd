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
