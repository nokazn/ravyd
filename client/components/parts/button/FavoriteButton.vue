<template>
  <v-btn
    :width="size"
    :height="size"
    :color="fab ? color : undefined"
    :fab="fab"
    :icon="!fab"
    :outlined="outlined"
    :disabled="disabled"
    :title="button.title"
    @click.stop="onClick"
  >
    <v-icon
      :size="iconSize"
      :color="value && !outlined ? iconColor : undefined"
    >
      {{ button.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

type Button = {
  icon: 'mdi-heart' | 'mdi-heart-outline';
  title: string;
};

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
    size: {
      type: Number,
      default: 36,
    },
    text: {
      type: String,
      default: '保存',
    },
    // fab の時のみ有効
    color: {
      type: String,
      default: 'grey darken-3',
    },
    iconColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
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
          icon: 'mdi-heart',
          title: `${props.text}しない`,
        }
        : {
          icon: 'mdi-heart-outline',
          title: `${props.text}する`,
        };
    });
    const iconSize = computed((): number => (props.size * 0.8) / Math.SQRT2);
    const onClick = () => { emit(INPUT, !props.value); };

    return {
      button,
      iconSize,
      onClick,
    };
  },
});
</script>
