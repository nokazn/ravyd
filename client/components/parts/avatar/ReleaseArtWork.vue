<template>
  <v-hover #default="{ hover }">
    <transition name="fade">
      <v-img
        :src="src"
        :alt="alt"
        :height="size"
        :width="size"
        :max-height="size"
        :max-width="size"
        :aspect-ratio="1"
        :class="$style.ReleaseArtWork">
        <v-overlay
          v-if="hover && isOverlayed"
          absolute
          :opacity="0.7">
          <v-hover #default="{ hover: buttonHoverd }">
            <v-icon
              :size="playButtonSize(buttonHoverd)"
              :class="$style.ReleaseArtWork__icon">
              {{ icon }}
            </v-icon>
          </v-hover>
        </v-overlay>
      </v-img>
    </transition>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

export type ReleaseArtWorkInfo = {
  src: string
  alt: string
  icon?: string
  size?: number
}

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'mdi-play-circle',
    },
    size: {
      type: Number,
      default: 160,
    },
    isOverlayed: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    playButtonSize(): (hover: boolean) => number {
      return (hover: boolean) => {
        const ratio = hover
          ? 0.375
          : 0.3;

        return this.size < 120
          ? 120 * ratio
          : this.size * ratio;
      };
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseArtWork {
  &__icon {
    cursor: pointer;
  }
}
</style>
