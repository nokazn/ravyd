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
        alt="user-avaar"
        :min-width="minSize || size"
        :min-height="minSize || size"
        :height="size"
        :width="size"
        :max-height="maxSize || size"
        :max-width="maxSize || size"
        :aspect-ratio="1"
        @load="onLoaded"
      >
        <AvatarOverlay
          :hover="isOverlayed && hover"
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
      :class="$style.UserAvatar__noAvatar"
      class="rounded-circle"
    >
      <v-icon :size="noAvatarIconSize">
        {{ defaultUserIcon }}
      </v-icon>
    </v-sheet>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/image/AvatarOverlay.vue';

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

type Data = {
  noAvatarIconSize: number
}

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

export type On = {
  ON_MEDIA_BUTTON_CLICKED: void
  ON_LOADED: void
}

export type Props = {
  src: string | undefined
  alt: string
  size?: number
  minSize?: number
  maxSize?: number
  isOverlayed?: boolean
  icon?: MediaIcon
  defaultUserIcon?: string
  smallIcon?: boolean
  shadow?: boolean
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
    isOverlayed: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String as PropType<MediaIcon>,
      default: 'mdi-play-circle',
    },
    defaultUserIcon: {
      type: String,
      default: 'mdi-account-circle-outline',
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

  data(): Data {
    const baseSize = this.size ?? this.minSize;
    let noAvatarIconSize: number;
    if (baseSize == null) {
      noAvatarIconSize = 60;
    } else {
      noAvatarIconSize = this.smallIcon
        ? baseSize * 0.4
        : baseSize;
    }

    return {
      noAvatarIconSize,
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
.UserAvatar {
  &__noAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
