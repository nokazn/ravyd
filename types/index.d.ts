/* eslint-disable camelcase */
export namespace Spotify {
  export namespace Auth {
    type CodeRequestBody = {
      client_id: string;
      response_type: 'code';
      redirect_uri: string;
      state?: string;
      scope: string;
      show_dialog?: string;
    }
    type TokenRequestBody = {
      grant_type: string;
      code: string;
      redirect_uri: string;
      client_id?: string;
      client_secret?: string;
    }
    type TokenResponseData = {
      access_token: string;
      token_type: string;
      scope: string;
      expires_in: number;
      refresh_toke: string;
    }
  }
}
