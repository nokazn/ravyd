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
import Vue from 'vue';

export type MediaButtonIcon = 'mdi-play' | 'mdi-pause'

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
    trackNumber: {
      type: Number,
      required: true,
    },
  },

  computed: {
    mediaButtonIcon(): MediaButtonIcon {
      return this.isPlayingTrack
        ? 'mdi-pause'
        : 'mdi-play';
    },
  },

  methods: {
    onClick() {
      this.$emit('on-clicked');
    },
  },
});
</script>
