<template>
  <v-overlay
    v-if="hover"
    absolute
    :opacity="0.7"
  >
    <v-hover #default="{ hover: buttonHoverd }">
      <v-btn
        icon
        @click.stop.prevent="onClicked"
      >
        <v-icon
          :size="mediaButtonSize(buttonHoverd)"
          :class="$style.AvatarOverlay__icon"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
    </v-hover>
  </v-overlay>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    hover: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    mediaButtonSize(): (hover: boolean) => number {
      return (hover: boolean) => {
        const ratio = hover
          ? 0.375
          : 0.3;
        const maxSize = 180;

        return this.size == null || this.size < maxSize
          ? maxSize * ratio
          : this.size * ratio;
      };
    },
  },

  methods: {
    onClicked() {
      this.$emit('on-clicked');
    },
  },
});
</script>

<style lang="scss" module>
.AvatarOverlay {
  &__icon {
    cursor: pointer;
  }
}
</style>
