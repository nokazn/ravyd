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
        @click.stop="onCOnfirmButtonClicked"
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
import Vue, { PropType } from 'vue';
import Modal, { On as OnModal } from '~/components/parts/modal/Modal.vue';

export const INPUT = 'input';
export const ON_CONFIRMED = 'on-confirmed';

export type On = {
  [INPUT]: boolean;
  [ON_CONFIRMED]: string | undefined;
}

export default Vue.extend({
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

  methods: {
    onCloseButtonClicked() {
      this.modal = false;
    },
    onCOnfirmButtonClicked() {
      this.$emit(ON_CONFIRMED, this.type);
    },
  },
});
</script>

<style lang="scss" module>
.ConfirmModal {
  z-index: z-index-of(modal);
}
</style>
