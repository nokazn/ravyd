import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import type dayjs from 'dayjs';
import type { NuxtAxiosInstance } from '@nuxtjs/axios';

import type { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import type { ServerEndpoints } from '~/plugins/server/endpoints';
import type { $Header } from '~/plugins/observable/header';
import type { $Overlay } from '~/plugins/observable/overlay';
import type { $Toast } from '~/plugins/observable/toast';

declare module '@nuxt/types/app' {

  interface NuxtAppOptions {
    // typed-vuex
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $subscribe: ExtendedSubscribe

    // plugin
    $dayjs: typeof dayjs
    $spotifyApi: NuxtAxiosInstance
    $spotify: SpotifyEndpoints
    $serverApi: NuxtAxiosInstance
    $server: ServerEndpoints

    // obserable
    $header: $Header
    $overlay: $Overlay
    $toast: $Toast
  }
}

declare global {
  interface Window {
    onNuxtReady: (callback: () => void) => void;
  }
}
