<template>
  <v-hover #default="{ hover }">
    <v-avatar
      v-if="src"
      :size="size">
      <v-img
        :src="src"
        alt="user-avaar"
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
    </v-avatar>
    <v-icon
      v-else
      :size="size"
      class="user-avatar">
      {{ defaultUserIcon }}
    </v-icon>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AvatarOverlay from '~/components/parts/avatar/AvatarOverlay.vue';

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export default Vue.extend({
  components: {
    AvatarOverlay,
  },

  props: {
    src: {
      required: true,
      validator(value) {
        return typeof value === 'string' || value == null;
      },
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
      default: 20,
    },
    isOverlayed: {
      type: Boolean,
      default: false,
    },
    defaultUserIcon: {
      type: String,
      default: 'mdi-account-circle-outline',
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
