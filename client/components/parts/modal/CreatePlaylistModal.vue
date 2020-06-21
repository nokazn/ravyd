<template>
  <PlaylistModal
    :is-shown="isShown"
    detail-of-method="作成"
    @on-changed="onChanged"
  />
</template>

<script lang="ts">
import Vue from 'vue';

import PlaylistModal, { On as OnModal, ON_CHANGED } from '~/components/containers/modal/PaylistModal.vue';

export type On = {
  [ON_CHANGED]: OnModal['on-changed']
}

export default Vue.extend({
  components: {
    PlaylistModal,
  },

  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onChanged(isShown: OnModal['on-changed']) {
      this.$emit(ON_CHANGED, isShown);
    },
  },
});
</script>
