<template>
  <PlaylistModal
    :is-shown="isShown"
    :handler="handler"
    detail-text="編集"
    result-text="更新"
    :form="form"
    @on-changed="onChanged"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import PlaylistModal, {
  On as OnModal,
  ON_CHANGED,
  Form,
  Handler,
} from '~/components/containers/modal/PaylistModal.vue';

export type { Form } from '~/components/containers/modal/PaylistModal.vue';

export type Data = {
  handler: Handler<'edit'>
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
    form: {
      type: Object as PropType<Form | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const handler = (payload: Parameters<Handler<'edit'>>[0]) => this.$dispatch('playlists/editPlaylist', payload)
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
