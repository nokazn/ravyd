<template>
  <v-btn
    icon
    large
    :disabled="disabled"
    title="次の曲"
    @click="onClicked"
  >
    <v-icon :size="size">
      mdi-skip-next
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 28,
    },
  },

  computed: {
    disabled(): boolean {
      return this.$getters()['playback/isDisallowed']('skipping_next');
    },
  },

  methods: {
    onClicked() {
      this.$dispatch('playback/next');
    },
  },
});
</script>
