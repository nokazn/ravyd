import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import dayjs from 'dayjs';
import { $Toast } from '~/plugins/toast';
import { Overlay } from '~/plugins/overlay';
import { Header } from '~/plugins/observable/header';

import { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import { ServerEndpoints } from '~/plugins/server/endpoints';

declare module 'vue/types/vue' {
  interface Vue {
    // css module
    $style: Record<string, string>,

    // typed-vuex
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $subscribe: ExtendedSubscribe

    // plugin
    $dayjs: typeof dayjs
    $spotify: SpotifyEndpoints
    $server: ServerEndpoints
    $toast: $Toast
    $overlay: Overlay
    $header: Header
  }
}
