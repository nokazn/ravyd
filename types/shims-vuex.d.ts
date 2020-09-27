import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import type dayjs from 'dayjs';
import type { NuxtAxiosInstance } from '@nuxtjs/axios';

import type { $Toast } from '~/plugins/observable/toast';
import type { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import type { ServerEndpoints } from '~/plugins/server/endpoints';

declare module 'vuex/types/index' {
  interface Store<S> {
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
    $toast: $Toast
  }
}
