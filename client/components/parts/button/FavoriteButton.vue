<template>
  <v-btn
    icon
    @click="onClicked">
    <v-icon :size="20">
      {{ favoriteIcon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isFavorited: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
  },

  computed: {
    favoriteIcon(): string {
      return this.isFavorited
        ? 'mdi-heart'
        : 'mdi-heart-outline';
    },
  },

  methods: {
    onClicked() {
      this.$emit('on-clicked', !this.isFavorited);
    },
  },
});
</script>
