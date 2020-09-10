<template>
  <v-dialog
    v-model="modal"
    :max-width="600"
    :class="$style.ConfirmModal"
  >
    <v-card :elevation="12">
      <div :class="$style.ConfirmModal__header">
        <v-card-title>
          {{ title }}
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

      <p :class="$style.ConfirmModal__text">
        <slot />
      </p>

      <v-card-actions :class="$style.ConfirmModal__footer">
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export const ON_CHANGED = 'on-changed';
export const ON_CONFIRMED = 'on-confirmed';

export type On = {
  [ON_CHANGED]: boolean
  [ON_CONFIRMED]: string
}

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as PropType<string | undefined>,
      required: true,
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
        return this.isShown;
      },
      set(isShown: boolean) {
        this.$emit(ON_CHANGED, isShown);
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

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > *:last-child {
      margin-right: 16px;
    }
  }

  &__text {
    margin: 0 20px 16px;
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
