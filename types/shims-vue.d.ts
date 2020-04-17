import {
  RootState,
  RootGetters,
  SFCCommit,
  SFCDispatch,
} from 'vuex';

declare module 'vue/types/vue' {
  interface Vue {
    $state: () => RootState
    $getters: () => RootGetters
    $commit: SFCCommit
    $dispatch: SFCDispatch
  }
}
