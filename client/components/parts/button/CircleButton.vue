<template>
  <v-btn
    icon
    v-bind="buttonProps"
    :disabled="disabled"
    @click="onClicked"
  >
    <v-icon :size="iconSize">
      <slot />
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type ButtonProps = {
  [k in 'x-large' | 'large' | 'small' | 'x-small']?: true
} & {
  outlined: boolean
}

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  props: {
    size: {
      type: [Number, String] as PropType<number | 'x-large' | 'large' | 'small' | 'x-small'>,
      default: undefined,
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

  computed: {
    buttonProps(): ButtonProps {
      return typeof this.size === 'number'
        ? {
          outlined: false,
        }
        : {
          [this.size]: true,
          outlined: this.outlined,
        };
    },
    iconSize(): number {
      // 数値で指定するときは outlined 無効の時のみ有効
      if (!this.outlined && typeof this.size === 'number') return this.size;

      switch (this.size) {
        case 'x-small':
          return 12;
        case 'small':
          return 16;
        case 'large' || 'x-large':
          return 24;
        default:
          return 20;
      }
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_CLICKED);
    },
  },
});
</script>
