import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
  ExtendedSubscribe,
} from 'typed-vuex';
import type dayjs from 'dayjs';

import type { SpotifyServices } from '~/services/spotify';
import type { ServerServices } from '~/services/server';
import type { Constant } from '~/plugins/constant';
import type { $Confirm } from '~/plugins/observable/confirm';
import type { $Header } from '~/plugins/observable/header';
import type { $Overlay } from '~/plugins/observable/overlay';
import type { $Toast } from '~/plugins/observable/toast';
import type { $Screen } from '~/plugins/observable/window';


declare module 'vue/types/vue' {
  interface Vue {
    // css module
    $style: Record<string, string>;

    // typed-vuex
    $state: () => RootState;
    $getters: () => RootGetters;
    $commit: SFCCommit;
    $dispatch: SFCDispatch;
    $subscribe: ExtendedSubscribe;

    // plugin
    $dayjs: typeof dayjs;
    $spotify: SpotifyServices;
    $server: ServerServices;
    $constant: Constant;

    // obserable
    $confirm: $Confirm;
    $header: $Header;
    $overlay: $Overlay;
    $toast: $Toast;
    $screen: $Screen;
  }
}
