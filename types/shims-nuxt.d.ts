import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';
import dayjs from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Toast } from '~/plugins/inject-toast';

import { SpotifyEndpoints } from '~/plugins/spotify/endpoints';

declare module '@nuxt/types/app' {

  interface NuxtAppOptions {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $dayjs: typeof dayjs
    $spotifyApi: NuxtAxiosInstance
    $spotify: SpotifyEndpoints
    $serverApi: NuxtAxiosInstance
    $toast: Toast
  }
}

declare global {
  interface Window {
    onNuxtReady: (callback: () => void) => void;
  }
}
