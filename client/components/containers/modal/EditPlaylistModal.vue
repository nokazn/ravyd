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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import PlaylistModal, {
  On as OnModal,
  INPUT,
  Form,
  Handler,
} from '~/components/containers/modal/PaylistModal.vue';

export type { Form } from '~/components/containers/modal/PaylistModal.vue';

export type On = {
  [INPUT]: OnModal['input']
}

export default defineComponent({
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

  setup(props, { root, emit }) {
    const modal = computed<boolean>({
      get() { return props.value; },
      set(value: OnModal['input']) { emit(INPUT, value); },
    });
    const handler = (payload: Parameters<Handler<'edit'>>[0]) => {
      return root.$dispatch('playlists/editPlaylist', payload)
        .catch((err: Error) => {
          console.error({ err });
          root.$toast.pushError(err.message);
        });
    };

    return {
      modal,
      handler,
    };
  },
});
</script>
