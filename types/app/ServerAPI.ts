export namespace ServerAPI {
  export namespace Auth {
    export type Token = {
      accessToken: string | undefined
      expireIn: number
      message?: string
    }

    export type Login = {
      accessToken: string | undefined
      expireIn: number
      message?: string
      url?: undefined
    } | {
      accessToken?: undefined
      expireIn?: undefined
      message?: undefined
      url: string
    }
  }
}
