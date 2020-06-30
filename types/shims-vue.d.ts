import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'vuex';
import dayjs from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Toast } from '~/plugins/toast';
import { Overlay } from '~/plugins/overlay';

import { SpotifyEndpoints } from '~/plugins/spotify/endpoints';

declare module 'vue/types/vue' {
  interface Vue {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $subscribe: ExtendedSubscribe
    $dayjs: typeof dayjs
    $spotifyApi: NuxtAxiosInstance
    $spotify: SpotifyEndpoints
    $serverApi: NuxtAxiosInstance
    $toast: Toast
    $overlay: Overlay
  }
}
