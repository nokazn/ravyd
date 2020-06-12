<template>
  <span :class="$style.TrackListMediaButton">
    <v-btn
      v-if="isHovered && !disabled"
      outlined
      small
      icon
      @click="onClick"
    >
      <v-icon :title="mediaButton.title">
        {{ mediaButton.icon }}
      </v-icon>
    </v-btn>

    <v-icon
      v-else-if="isPlayingTrack && !disabled"
      title="再生中"
    >
      mdi-volume-high
    </v-icon>

    <span
      v-else-if="trackNumber != null"
      :title="disabledTitle"
      :class="{ 'inactive--text': disabled }"
    >
      {{ trackNumber }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export type MediaButton = {
  icon: 'mdi-play' | 'mdi-pause'
  title: '再生' | '停止'
}

export type Data = {
  disabledTitle: string | undefined
}

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
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    return {
      disabledTitle: this.disabled ? '再生できない項目' : undefined,
    };
  },

  computed: {
    mediaButton(): MediaButton {
      return this.isPlayingTrack
        ? {
          icon: 'mdi-pause',
          title: '停止',
        }
        : {
          icon: 'mdi-play',
          title: '再生',
        };
    },
  },

  methods: {
    onClick() {
      this.$emit('on-clicked');
    },
  },
});
</script>

<style lang="scss" module>
.TrackListMediaButton {
  display: inline-flex;
  justify-content: center;
  min-width: 28px;
}
</style>
