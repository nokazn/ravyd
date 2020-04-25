import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';
import { Dayjs } from 'dayjs';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module 'vue/types/vue' {
  interface Vue {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $dayjs: Dayjs
    $spotifyApi: NuxtAxiosInstance
    $serverApi: NuxtAxiosInstance
  }
}
