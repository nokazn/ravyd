<template>
  <PlaylistModal
    v-model="modal"
    :handler="handler"
    detail-text="作成"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import PlaylistModal, { On as OnModal, INPUT, Handler } from '~/components/containers/modal/PaylistModal.vue';

export type Data = {
  handler: Handler<'create'>
}

export type On = {
  [INPUT]: OnModal['input']
}

export default Vue.extend({
  components: {
    PlaylistModal,
  },

  props: {
    value: {
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

  computed: {
    modal: {
      get(): boolean {
        return this.value;
      },
      set(modal: OnModal['input']) {
        this.$emit(INPUT, modal);
      },
    },
  },
});
</script>
