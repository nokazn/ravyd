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
import { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import { ServerEndpoints } from '~/plugins/server/endpoints';

declare module 'vuex/types/index' {
  interface Store<S> {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $subscribe: ExtendedSubscribe
    $dayjs: typeof dayjs
    $spotifyApi: NuxtAxiosInstance
    $spotify: SpotifyEndpoints
    $serverApi: NuxtAxiosInstance
    $server: ServerEndpoints
    $toast: $Toast
  }
}
