<template>
  <v-hover #default="{ hover }">
    <v-avatar
      v-if="src"
      :size="size">
      <v-img
        :src="src"
        alt="user-avaar">
        <v-overlay
          v-if="hover && isOverlayed"
          absolute
          :opacity="0.7">
          <v-hover #default="{ hover: buttonHoverd }">
            <v-btn
              icon
              @click.stop="onClicked">
              <v-icon
                :size="mediaButtonSize(buttonHoverd)">
                {{ icon }}
              </v-icon>
            </v-btn>
          </v-hover>
        </v-overlay>
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

export type MediaIcon = 'mdi-play-circle' | 'mdi-pause-circle'

export default Vue.extend({
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
