<template>
  <v-btn
    v-if="fab"
    fab
    color="success"
    :width="height"
    :height="height"
    :title="text"
    @click="onClicked"
  >
    <v-icon>
      {{ icon }}
    </v-icon>
  </v-btn>
  <v-btn
    v-else
    color="success"
    rounded
    :height="height"
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
    height: {
      type: Number,
      default: 36,
    },
    fab: {
      type: Boolean,
      default: false,
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
