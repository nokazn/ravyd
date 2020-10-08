<template>
  <CircleButton
    title="次の曲"
    :size="size"
    :disabled="disabled"
    @click="onClicked"
  >
    mdi-skip-next
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
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
