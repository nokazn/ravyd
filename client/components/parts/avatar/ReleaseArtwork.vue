<template>
  <v-hover #default="{ hover }">
    <v-img
      v-if="src != null"
      :src="src"
      :alt="alt"
      :min-width="minSize || size"
      :min-height="minSize || size"
      :width="size"
      :height="size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
      :aspect-ratio="1"
      :class="{ 'g-box-shadow': shadow }"
      @load="onLoaded"
    >
      <template v-if="isOverlayed">
        <AvatarOverlay
          v-show="hover"
          :hover="hover"
          :size="size"
          :icon="icon"
          @on-clicked="onClicked"
        />
      </template>
    </v-img>

    <v-sheet
      v-else
      :min-width="minSize || size"
      :min-height="minSize || size"
      :width="size"
      :height="size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
      :class="$style.ReleaseArtwork__noArtwork"
    >
      <v-icon :size="noArtworkIconSize">
        mdi-music
      </v-icon>
    </v-sheet>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/avatar/AvatarOverlay.vue';

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export type Data = {
  noArtworkIconSize: number
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
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    alt: {
      type: String,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    minSize: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    maxSize: {
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

  data(): Data {
    const baseSize = this.size ?? this.minSize;
    const noArtworkIconSize = baseSize != null
      ? baseSize * 0.4
      : 60;

    return {
      noArtworkIconSize,
    };
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

<style lang="scss" module>
.ReleaseArtwork {
  &__noArtwork {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
