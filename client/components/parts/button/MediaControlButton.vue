<template>
  <v-btn
    color="cyan darken-3"
    rounded
    :class="$style.MediaControlButton"
    @click="onClicked"
  >
    <v-icon :class="$style.MediaControlButton__icon">
      {{ icon }}
    </v-icon>
    <span :class="$style.MediaControlButton__text">
      {{ text }}
    </span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isPlaying: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    icon(): 'mdi-play' | 'mdi-pause' {
      return this.isPlaying
        ? 'mdi-pause'
        : 'mdi-play';
    },
    text(): '再生' | '停止' {
      return this.isPlaying
        ? '停止'
        : '再生';
    },
  },

  methods: {
    onClicked() {
      this.$emit('on-clicked', !this.isPlaying);
    },
  },
});
</script>

<style lang="scss" module>
.MediaControlButton {
  &__icon,
  &__text {
    margin-right: 2px;
  }

}
</style>
