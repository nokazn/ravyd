<template>
  <v-hover #default="{ hover }">
    <v-img
      :src="src"
      :alt="alt"
      :height="size"
      :width="size"
      :max-height="size"
      :max-width="size"
      :aspect-ratio="1">
      <avatar-overlay
        :hover="hover"
        :size="size"
        :icon="icon"
        @on-clicked="onClicked" />
    </v-img>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/avatar/AvatarOverlay.vue';

export type ReleaseArtWorkInfo = {
  src: string
  alt: string
  icon?: string
  size?: number
}

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export type Data = {
  isMediaButtonPushed: boolean
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
    icon: {
      type: String as PropType<MediaIcon>,
      default: 'mdi-play-circle',
    },
    size: {
      type: Number,
      default: 160,
    },
    isOverlayed: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    mediaButtonSize(): (hover: boolean) => number {
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

  methods: {
    onClicked() {
      this.$emit('on-media-button-clicked');
    },
  },
});
</script>
