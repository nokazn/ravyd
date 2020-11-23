<template>
  <v-dialog
    v-model="modal"
    :fullscreen="fullscreen"
    :max-width="600"
    :class="$style.Modal"
  >
    <v-card
      rounded="lg"
      :elevation="12"
      :color="$constant.CARD_BACKGROUND_COLOR"
      :class="$style.Card"
    >
      <div :class="$style.Card__header">
        <v-card-title :class="$style.Card__title">
          <slot name="header" />
        </v-card-title>
        <v-btn
          icon
          title="閉じる"
          @click="onCloseButtonClicked"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <div :class="$style.Card__content">
        <slot />
      </div>

      <v-card-actions :class="$style.Card__footer">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const modal = computed<boolean>({
      get() { return props.value; },
      set(value) { emit(INPUT, value); },
    });
    const onCloseButtonClicked = () => { modal.value = false; };

    return {
      modal,
      onCloseButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.Modal {
  z-index: z-index-of(modal);
}

.Card {
  padding: 8px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    padding: max(12px, 2%);
  }

  &__content {
    padding: 0 2%;
  }

  &__footer {
    padding: 2%;
    display: flex;
    justify-content: flex-end;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
