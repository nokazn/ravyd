<template>
  <PlayerBarMobile v-if="$screen.isMobile" />
  <PlayerBarPc v-else-if="$screen.isPc" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import PlayerBarMobile from '~/components/globals/PlayerBar.mobile.vue';
import PlayerBarPc from '~/components/globals/PlayerBar.pc.vue';

export default defineComponent({
  components: {
    PlayerBarMobile,
    PlayerBarPc,
  },

  setup(_, { root }) {
    onMounted(() => { root.$dispatch('player/initPlayer'); });
  },
});
</script>
