<template>
  <div :class="$style.MediaController">
    <SkipButton
      v-if="isEpisode"
      :seconds="-15"
    />
    <ShuffleButton v-else />
    <PreviousButton />
    <MediaButton
      circle
      :size="40"
    />
    <NextButton />
    <SkipButton
      v-if="isEpisode"
      :seconds="15"
    />
    <RepeatButton v-else />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import SkipButton from '~/components/containers/player/SkipButton.vue';
import ShuffleButton from '~/components/containers/player/ShuffleButton.vue';
import PreviousButton from '~/components/containers/player/PreviousButton.vue';
import MediaButton from '~/components/containers/player/MediaButton.vue';
import NextButton from '~/components/containers/player/NextButton.vue';
import RepeatButton from '~/components/containers/player/RepeatButton.vue';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  components: {
    SkipButton,
    ShuffleButton,
    PreviousButton,
    MediaButton,
    NextButton,
    RepeatButton,
  },

  props: {
    type: {
      type: String as PropType<SpotifyAPI.Player.PlayingType | undefined>,
      default: undefined,
    },
  },

  computed: {
    isEpisode(): boolean {
      return this.type === 'episode';
    },
  },
});
</script>

<style lang="scss" module>
.MediaController {
  display: flex;
  align-items: center;
  justify-content: center;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
