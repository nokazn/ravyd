import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import type dayjs from 'dayjs';

import type { SpotifyEndpoints } from '~/plugins/spotify/endpoints';
import type { ServerEndpoints } from '~/plugins/server/endpoints';
import type { $Header } from '~/plugins/observable/header';
import type { $Overlay } from '~/plugins/observable/overlay';
import type { $Toast } from '~/plugins/observable/toast';
import type { $Window } from '~/plugins/observable/window';


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

    // obserable
    $header: $Header
    $overlay: $Overlay
    $toast: $Toast
    $window: $Window
  }
}
