<template>
  <v-hover #default="{ hover }">
    <v-avatar
      v-if="src != null"
      :min-width="minSize || size"
      :min-height="minSize || size"
      :size="size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
      :class="{ 'g-box-shadow': shadow }"
    >
      <v-img
        :src="src"
        :alt="type"
        :min-width="minSize || size"
        :min-height="minSize || size"
        :height="size"
        :width="size"
        :max-height="maxSize || size"
        :max-width="maxSize || size"
        :aspect-ratio="1"
        @load="onLoaded"
      >
        <ImageOverlay
          v-if="overlay"
          :hover="hover"
          :size="size"
          :icon="icon"
          @on-clicked="onClicked"
        />
      </v-img>
    </v-avatar>

    <v-sheet
      v-else
      :min-width="minSize || size"
      :min-height="minSize || size"
      :width="size"
      :height="size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
      :class="$style.UserAvatar__default"
      class="rounded-circle"
    >
      <v-icon :size="defaultIconSize">
        {{ defaultIcon }}
      </v-icon>
    </v-sheet>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ImageOverlay from '~/components/parts/image/ImageOverlay.vue';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

export type On = {
  ON_MEDIA_BUTTON_CLICKED: void
  ON_LOADED: void
}
export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle';
type AvatarType = 'user' | 'artist';

export default Vue.extend({
  components: {
    ImageOverlay,
  },

  props: {
    type: {
      type: String as PropType<AvatarType>,
      default: 'user',
    },
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
    overlay: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String as PropType<MediaIcon>,
      default: 'mdi-play-circle',
    },
    smallIcon: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    defaultIcon(): string {
      return this.type === 'user'
        ? 'mdi-account'
        : 'mdi-account-music';
    },
    defaultIconSize(): number {
      const baseSize = this.size ?? this.minSize;
      if (baseSize == null) return 60;
      return this.smallIcon
        ? baseSize * 0.4
        : baseSize;
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

<style lang="scss" module>
.UserAvatar {
  &__default {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
