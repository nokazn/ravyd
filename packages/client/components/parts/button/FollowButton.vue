<template>
  <v-hover v-slot="{ hover }">
    <v-btn
      rounded
      :width="width"
      :color="color"
      :outlined="!value"
      :height="height"
      @click="onClick"
    >
      <v-icon
        left
        :size="18"
      >
        {{ button(hover).icon }}
      </v-icon>
      {{ button(hover).text }}
    </v-btn>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

type Button = {
  icon: 'mdi-heart-plus-outline' | 'mdi-heart-outline' | 'mdi-heart';
  text: 'フォロー' | 'フォローしない' | 'フォロー中';
}

const INPUT = 'input';

export type On = {
  [INPUT]: boolean
}

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      default: 172,
    },
    height: {
      type: Number,
      default: 36,
    },
  },

  emits: {
    [INPUT]: (_value: boolean) => true,
  },

  setup(props, { emit }) {
    const color = computed((): string | undefined => {
      return props.value
        ? 'secondary'
        : undefined;
    });
    const button = (hover: boolean): Button => {
      if (!props.value) {
        return {
          icon: 'mdi-heart-plus-outline',
          text: 'フォロー',
        };
      }
      return hover
        ? {
          icon: 'mdi-heart-outline',
          text: 'フォローしない',
        }
        : {
          icon: 'mdi-heart',
          text: 'フォロー中',
        };
    };
    const onClick = () => { emit(INPUT, !props.value); };

    return {
      color,
      button,
      onClick,
    };
  },
});
</script>
