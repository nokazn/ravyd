<template>
  <v-btn
    icon
    v-bind="buttonProps"
    @click="onClicked">
    <v-icon :size="iconSize">
      {{ favoriteIcon }}
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

export type FavoriteIcon = 'mdi-heart' | 'mdi-heart-outline';

export default Vue.extend({
  props: {
    isFavorited: {
      type: Boolean,
      required: true,
    },
    size: {
      type: [Number, String] as PropType<number | 'x-large' | 'large' | 'small' | 'x-small'>,
      default: undefined,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    favoriteIcon(): FavoriteIcon {
      return this.isFavorited
        ? 'mdi-heart'
        : 'mdi-heart-outline';
    },
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
      this.$emit('on-clicked', !this.isFavorited);
    },
  },
});
</script>
