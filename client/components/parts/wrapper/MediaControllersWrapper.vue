<template>
  <div :class="$style.MediaControler">
    <shuffle-button />
    <previous-button />
    <media-button />
    <next-button />
    <repeat-button />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ShuffleButton from '~/components/containers/player/ShuffleButton.vue';
import PreviousButton from '~/components/containers/player/PreviousButton.vue';
import MediaButton from '~/components/containers/player/MediaButton.vue';
import NextButton from '~/components/containers/player/NextButton.vue';
import RepeatButton from '~/components/containers/player/RepeatButton.vue';

export default Vue.extend({
  components: {
    ShuffleButton,
    PreviousButton,
    MediaButton,
    NextButton,
    RepeatButton,
  },
});
</script>

<style lang="scss" module>
.MediaControler {
  display: flex;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
