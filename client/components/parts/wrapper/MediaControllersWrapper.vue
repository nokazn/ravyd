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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import SkipButton from '~/components/containers/player/SkipButton.vue';
import ShuffleButton from '~/components/containers/player/ShuffleButton.vue';
import PreviousButton from '~/components/containers/player/PreviousButton.vue';
import MediaButton from '~/components/containers/player/MediaButton.vue';
import NextButton from '~/components/containers/player/NextButton.vue';
import RepeatButton from '~/components/containers/player/RepeatButton.vue';
import { SpotifyAPI } from '~~/types';

export default defineComponent({
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

  setup(props) {
    const isEpisode = computed(() => props.type === 'episode');
    return { isEpisode };
  },
});
</script>

<style lang="scss" module>
.MediaController {
  display: flex;
  align-items: center;
  justify-content: center;

  & > *:not(:last-child) {
    margin-right: 12px;
  }
}
</style>
