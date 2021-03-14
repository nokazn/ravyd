import type {
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
import type { $Keyboard } from '~/plugins/observable/keyboard';
import type { $Overlay } from '~/plugins/observable/overlay';
import type { $Screen } from '~/plugins/observable/screen';
import type { $Toast } from '~/plugins/observable/toast';

declare module 'vue/types/vue' {
  interface Vue {
    // CSS modules
    $style: Record<string, string>;

    // typed-vuex
    $getters: () => RootGetters;
    $commit: SFCCommit;
    $dispatch: SFCDispatch;
    $subscribe: ExtendedSubscribe;

    // plugin
    $dayjs: typeof dayjs;
    $spotify: SpotifyServices;
    $server: ServerServices;
    $constant: Constant;

    // observable
    $confirm: $Confirm;
    $header: $Header;
    $keyboard: $Keyboard;
    $overlay: $Overlay;
    $screen: $Screen;
    $toast: $Toast;
  }
}
