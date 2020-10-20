<template>
  <PlayerBarMobile
    v-if="$screen.isMobile"
    :loaded="loaded"
  />
  <PlayerBarPc
    v-else-if="$screen.isPc"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
} from '@vue/composition-api';
import PlayerBarMobile from '~/components/globals/PlayerBar.mobile.vue';
import PlayerBarPc from '~/components/globals/PlayerBar.pc.vue';

export default defineComponent({
  components: {
    PlayerBarMobile,
    PlayerBarPc,
  },

  setup(_, { root }) {
    const loaded = ref(false);

    let mutationUnsubscribe: (() => void) | undefined;
    onMounted(() => {
      root.$dispatch('player/initPlayer');
      // when a player has already been initialized in a mounted hook, set to true
      if (root.$getters()['playback/hasTrack']) {
        loaded.value = true;
      }
      mutationUnsubscribe = root.$subscribe((mutation) => {
        switch (mutation.type) {
          case 'playback/SET_CURRENT_TRACK':
            loaded.value = true;
            if (mutationUnsubscribe != null) {
              mutationUnsubscribe();
            }
            break;
          default:
            break;
        }
      });
    });
    onBeforeUnmount(() => {
      if (mutationUnsubscribe != null) {
        mutationUnsubscribe();
      }
    });

    return { loaded };
  },
});
</script>
