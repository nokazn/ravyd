<template>
  <PlaylistModal
    v-model="modal"
    detail-text="作成"
    :handler="handler"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import PlaylistModal, {
  On as OnModal,
  INPUT,
  Handler,
} from '~/components/containers/modal/PlaylistModal.vue';

export type On = {
  [INPUT]: OnModal['input'];
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
  },

  setup(props, { emit, root }) {
    const modal = computed<boolean>({
      get() { return props.value; },
      set(value: OnModal['input']) { emit(INPUT, value); },
    });
    const handler = (payload: Parameters<Handler<'create'>>[0]) => {
      return root.$dispatch('playlists/createPlaylist', payload)
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
