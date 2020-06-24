<template>
  <v-btn
    color="success"
    rounded
    :disabled="disabled"
    @click="onClicked"
  >
    <v-icon left>
      {{ icon }}
    </v-icon>
    <span>
      {{ text }}
    </span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: boolean
}

export default Vue.extend({
  props: {
    isPlaying: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      this.$emit(ON_CLICKED, !this.isPlaying);
    },
  },
});
</script>
