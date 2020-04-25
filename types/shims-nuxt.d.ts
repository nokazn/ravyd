import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';
import { Dayjs } from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module '@nuxt/types/app' {
  interface NuxtAppOptions {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $dayjs: Dayjs
    $spotifyApi: NuxtAxiosInstance
    $serverApi: NuxtAxiosInstance
  }
}
