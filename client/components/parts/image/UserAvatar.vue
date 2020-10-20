<template>
  <v-hover #default="{ hover }">
    <v-avatar
      v-if="src != null"
      :size="size"
      :min-width="minSize || size"
      :min-height="minSize || size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
      :class="{ 'g-box-shadow': shadow }"
    >
      <v-img
        :src="src"
        :alt="type"
        :height="size"
        :width="size"
        :min-width="minSize || size"
        :min-height="minSize || size"
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
          @click="onClick"
        />
      </v-img>
    </v-avatar>

    <div
      v-else
      :class="$style.Ratio"
    >
      <svg viewBox="0 0 1 1" />
      <v-sheet
        :width="size"
        :height="size"
        :min-width="minSize || size"
        :min-height="minSize || size"
        :max-width="maxSize || size"
        :max-height="maxSize || size"
        :class="$style.UserAvatar__default"
        class="rounded-circle"
      >
        <v-icon :size="defaultIconSize">
          {{ defaultIcon }}
        </v-icon>
      </v-sheet>
    </div>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import ImageOverlay from '~/components/parts/image/ImageOverlay.vue';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

export type On = {
  ON_MEDIA_BUTTON_CLICKED: void;
  ON_LOADED: void;
}
export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle';
type AvatarType = 'user' | 'artist';

export default defineComponent({
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
    shadow: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    [ON_MEDIA_BUTTON_CLICKED]: null,
    [ON_LOADED]: null,
  },

  setup(props, { emit }) {
    const defaultIcon = computed(() => {
      return props.type === 'user'
        ? 'mdi-account'
        : 'mdi-account-music';
    });
    const defaultIconSize = computed(() => {
      const baseSize = props.size ?? props.minSize ?? 60;
      return baseSize * 0.875;
    });
    const onClick = () => { emit(ON_MEDIA_BUTTON_CLICKED); };
    const onLoaded = () => { emit(ON_LOADED); };

    return {
      defaultIcon,
      defaultIconSize,
      onClick,
      onLoaded,
    };
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

// viewBox 0 0 1 1 の svg 要素と同じ位置に v-sheet を配置する
.Ratio {
  display: grid;

  & > * {
    grid-area: 1 / 1 / -1 / -1;
  }
}
</style>
