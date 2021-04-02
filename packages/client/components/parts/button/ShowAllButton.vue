<template>
  <v-btn
    rounded
    text
    :width="width"
    :small="small"
    :title="button.text"
    :class="$style.ShowAllButton"
    @click="onClick"
  >
    <div :class="$style.ShowAllButton__wrapper">
      <v-icon
        :left="!icon"
        :small="small"
      >
        {{ button.icon }}
      </v-icon>

      <span v-if="!icon">
        {{ button.text }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

type Button = {
  icon: 'mdi-chevron-down' | 'mdi-chevron-up';
  text: string;
};

export const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
};

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    small: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    [INPUT]: (_value: boolean) => true,
  },

  setup(props, { emit }) {
    const button = computed((): Button => {
      return props.value
        ? {
          text: '折りたたむ',
          icon: 'mdi-chevron-up',
        }
        : {
          text: 'すべて表示',
          icon: 'mdi-chevron-down',
        };
    });
    const onClick = () => { emit(INPUT, !props.value); };

    return {
      button,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.ShowAllButton {
  &__wrapper {
    padding: 0 0.8em;
  }
}
</style>
