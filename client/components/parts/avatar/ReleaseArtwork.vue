<template>
  <v-hover #default="{ hover }">
    <v-img
      :src="src"
      :alt="alt"
      :height="size"
      :width="size"
      :max-height="size"
      :max-width="size"
      :aspect-ratio="1"
      :class="{ 'g-box-shadow': shadow }"
      @load="onLoaded"
    >
      <AvatarOverlay
        v-if="isOverlayed && hover"
        :hover="hover"
        :size="size"
        :icon="icon"
        @on-clicked="onClicked"
      />
    </v-img>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/avatar/AvatarOverlay.vue';

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export type Data = {
  isMediaButtonPushed: boolean
}

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

export type On = {
  [ON_MEDIA_BUTTON_CLICKED]: void
  [ON_LOADED]: void
}

export default Vue.extend({
  components: {
    AvatarOverlay,
  },

  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    icon: {
      type: String as PropType<MediaIcon>,
      default: 'mdi-play-circle',
    },
    isOverlayed: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_MEDIA_BUTTON_CLICKED);
    },
    onLoaded() {
      this.$emit(ON_LOADED);
    },
  },
});
</script>
