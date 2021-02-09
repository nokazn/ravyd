import type {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'typed-vuex';
import type dayjs from 'dayjs';
import type { TypedNuxtAxiosInstance } from 'typed-axios';

import type { Constant } from '~/plugins/constant';
import type { $Toast } from '~/plugins/observable/toast';
import type { SpotifyServices } from '~/services/spotify';
import type { ServerServices } from '~/services/server';

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    // typed-vuex
    $state: () => RootState;
    $getters: () => RootGetters;
    $commit: SFCCommit;
    $dispatch: SFCDispatch;

    // plugin
    $dayjs: typeof dayjs;
    $constant: Constant;
    $spotifyApi: TypedNuxtAxiosInstance;
    $spotify: SpotifyServices;
    $serverApi: TypedNuxtAxiosInstance;
    $server: ServerServices;

    // observable
    $toast: $Toast;
  }
}
