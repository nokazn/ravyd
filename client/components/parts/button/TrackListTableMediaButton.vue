<template>
  <v-btn
    v-if="isHovered"
    outlined
    small
    icon
    @click="onClick">
    <v-icon>
      {{ mediaButtonIcon }}
    </v-icon>
  </v-btn>
  <v-icon v-else-if="isPlayingTrack">
    mdi-volume-high
  </v-icon>
  <span v-else>
    {{ trackNumber }}
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type MediaButtonIcon = 'mdi-play' | 'mdi-heart-outline'

export default Vue.extend({
  props: {
    isHovered: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    mediaButtonIcon: {
      type: String as PropType<MediaButtonIcon>,
      required: true,
    },
    trackNumber: {
      type: Number,
      required: true,
    },
  },

  methods: {
    onClick() {
      this.$emit('on-clicked');
    },
  },
});
</script>
