import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';
import dayjs from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module '@nuxt/types/app' {
  interface NuxtAppOptions {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $dayjs: typeof dayjs
    $spotifyApi: NuxtAxiosInstance
    $serverApi: NuxtAxiosInstance
  }
}
