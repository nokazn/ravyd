import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import dayjs from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { $Toast } from '~/plugins/toast';
import { Overlay } from '~/plugins/overlay';

import { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import { ServerEndpoints } from '~/plugins/server/endpoints';
import { Header } from '~/plugins/observable/header';

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
    $toast: $Toast
    $overlay: Overlay
    $header: Header
  }
}

declare global {
  interface Window {
    onNuxtReady: (callback: () => void) => void;
  }
}
