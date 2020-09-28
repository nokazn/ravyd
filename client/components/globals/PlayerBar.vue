<template>
  <PlayerBarMobile
    v-if="$window.isMobile"
    :loaded="loaded"
  />
  <PlayerBarPc
    v-else-if="$window.isPc"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import PlayerBarMobile from '~/components/globals/PlayerBar.mobile.vue';
import PlayerBarPc from '~/components/globals/PlayerBar.pc.vue';

type Data = {
  loaded: boolean;
  mutationUnsubscribe: (() => void) | undefined;
}

export default Vue.extend({
  components: {
    PlayerBarMobile,
    PlayerBarPc,
  },

  data(): Data {
    return {
      loaded: false,
      mutationUnsubscribe: undefined,
    };
  },

  mounted() {
    this.$dispatch('player/initPlayer');

    // 再マウントされたときなどにすでにプレイヤーが初期化されていれば true
    if (this.$state().player.playbackPlayer != null) {
      this.loaded = true;
    }

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'player/SET_PLAYBACK_PLAYER':
          setTimeout(() => {
            this.loaded = true;
          }, 500);
          break;
        default:
          break;
      }
    });
  },
});
</script>
