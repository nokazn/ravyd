<template>
  <Modal
    v-model="modal"
    :class="$style.ConfirmModal"
  >
    <template #header>
      {{ title }}
    </template>

    <template #footer>
      <v-btn
        text
        rounded
        :min-width="90"
        @click="onCloseButtonClicked"
      >
        キャンセル
      </v-btn>
      <v-btn
        rounded
        :min-width="90"
        :color="color"
        :loading="loading"
        @click.stop="onConfirmButtonClicked"
      >
        {{ text }}
      </v-btn>
    </template>

    <p>
      <slot />
    </p>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import Modal, { On as OnModal } from '~/components/parts/modal/Modal.vue';

export const INPUT = 'input';
export const ON_CONFIRMED = 'on-confirmed';

export type On = {
  [INPUT]: boolean;
  [ON_CONFIRMED]: string | undefined;
};

export default defineComponent({
  components: {
    Modal,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    color: {
      type: String,
      default: 'success',
    },
    title: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    text: {
      type: String,
      default: '確認',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const modal = computed<boolean>({
      get() { return props.value; },
      set(value: OnModal['input']) { emit(INPUT, value); },
    });
    const onCloseButtonClicked = () => { modal.value = false; };
    const onConfirmButtonClicked = () => { emit(ON_CONFIRMED, props.type); };

    return {
      modal,
      onCloseButtonClicked,
      onConfirmButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.ConfirmModal {
  z-index: z-index-of(modal);
}
</style>
