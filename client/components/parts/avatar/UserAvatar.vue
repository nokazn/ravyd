<template>
  <v-hover #default="{ hover }">
    <v-avatar
      v-if="src != null"
      :size="size"
      :class="{ 'g-box-shadow': shadow }"
    >
      <v-img
        :src="src"
        alt="user-avaar"
        :height="size"
        :width="size"
        :max-height="size"
        :max-width="size"
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
      :min-width="size"
      :min-height="size"
      :class="$style.UserAvatar__noAvatar"
    >
      <v-icon :size="noAvatarIconSize">
        {{ defaultUserIcon }}
      </v-icon>
    </v-sheet>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/avatar/AvatarOverlay.vue';

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export type Data = {
  noAvatarIconSize: number
}

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

export type On = {
  ON_MEDIA_BUTTON_CLICKED: void
  ON_LOADED: void
}

export default Vue.extend({
  components: {
    AvatarOverlay,
  },

  props: {
    src: {
      type: String,
      default: undefined,
    },
    alt: {
      type: String,
      required: true,
    },
    icon: {
      type: String as PropType<MediaIcon>,
      default: 'mdi-play-circle',
    },
    size: {
      type: Number,
      default: 180,
    },
    isOverlayed: {
      type: Boolean,
      default: false,
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
    return {
      noAvatarIconSize: this.smallIcon
        ? this.size * 0.6
        : this.size,
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
.UserAvatar{
  &__noAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
