import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';
import { Dayjs } from 'dayjs';

declare module '@nuxt/types/app' {
  interface NuxtAppOptions {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
    $dayjs: Dayjs
  }
}
