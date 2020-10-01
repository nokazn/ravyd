<template>
  <v-dialog
    v-model="modal"
    :fullscreen="$window.isSingleColumn"
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
        <v-card-title>
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
import Vue from 'vue';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    modal: {
      get(): boolean {
        return this.value;
      },
      set(modal: boolean) {
        this.$emit(INPUT, modal);
      },
    },
  },

  methods: {
    onCloseButtonClicked() {
      this.modal = false;
    },
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

    & > *:last-child {
      margin-right: 12px;
    }
  }

  &__content {
    padding: 0 16px;
  }

  &__footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
