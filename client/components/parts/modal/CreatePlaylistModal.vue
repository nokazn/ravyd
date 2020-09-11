<template>
  <PlaylistModal
    :is-shown="isShown"
    :handler="handler"
    detail-text="作成"
    @on-changed="onChanged"
  />
</template>

<script lang="ts">
import Vue from 'vue';

import PlaylistModal, { On as OnModal, ON_CHANGED, Handler } from '~/components/containers/modal/PaylistModal.vue';

export type Data = {
  handler: Handler<'create'>
}

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

  data(): Data {
    const handler = (payload: Parameters<Handler<'create'>>[0]) => this.$dispatch('playlists/createPlaylist', payload)
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.push({
          color: 'error',
          message: err.message,
        });
      });

    return {
      handler,
    };
  },

  methods: {
    onChanged(isShown: OnModal['on-changed']) {
      this.$emit(ON_CHANGED, isShown);
    },
  },
});
</script>
