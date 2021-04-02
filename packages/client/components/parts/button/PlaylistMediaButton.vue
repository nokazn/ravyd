<template>
  <CircleButton
    :size="size"
    :outlined="outlined"
    :disabled="disabled"
    :title="button.title"
    @click="onClick"
  >
    {{ button.icon }}
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type Button = {
  icon: 'mdi-play' | 'mdi-pause';
  title: '再生' | '停止' | '再生できない項目';
};

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
};

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
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
      if (props.disabled) {
        return {
          icon: 'mdi-play',
          title: '再生できない項目',
        };
      }
      if (!props.value) {
        return {
          icon: 'mdi-play',
          title: '再生',
        };
      }
      return {
        icon: 'mdi-pause',
        title: '停止',
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
