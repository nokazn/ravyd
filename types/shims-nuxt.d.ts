import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'typed-vuex';
import type dayjs from 'dayjs';
import type { TypedNuxtAxiosInstance } from 'typed-axios';

import type { SpotifyServices } from '~/services/spotify';
import type { ServerServices } from '~/services/server';
import type { $Header } from '~/plugins/observable/header';
import type { $Overlay } from '~/plugins/observable/overlay';
import type { $Toast } from '~/plugins/observable/toast';

declare module '@nuxt/types/app' {

  interface NuxtAppOptions {
    // typed-vuex
    $state: () => RootState;
    $getters: () => RootGetters;
    $commit: SFCCommit;
    $dispatch: SFCDispatch;

    // plugin
    $dayjs: typeof dayjs;
    $spotifyApi: TypedNuxtAxiosInstance;
    $spotify: SpotifyServices;
    $serverApi: TypedNuxtAxiosInstance;
    $server: ServerServices;

    // observable
    $header: $Header;
    $overlay: $Overlay;
    $toast: $Toast;
  }
}

declare global {
  interface Window {
    onNuxtReady: (callback: () => void) => void;
  }
}
