<template>
  <PlaylistModal
    v-model="modal"
    :handler="handler"
    detail-text="編集"
    result-text="更新"
    :form="form"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PlaylistModal, {
  On as OnModal,
  INPUT,
  Form,
  Handler,
} from '~/components/containers/modal/PaylistModal.vue';

export type { Form } from '~/components/containers/modal/PaylistModal.vue';

export type Data = {
  handler: Handler<'edit'>
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
    form: {
      type: Object as PropType<Form | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const handler = (payload: Parameters<Handler<'edit'>>[0]) => this.$dispatch('playlists/editPlaylist', payload)
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError(err.message);
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
