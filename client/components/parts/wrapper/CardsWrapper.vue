<template>
  <div
    :class="$style.CardsWrapper"
    :style="cssProps"
  >
    <slot />

    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
    <div :class="$style.CardsWrapper__spacer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/constants';

type CssProps = {
  [k: string]: string
}

export default Vue.extend({
  props: {
    margin: {
      type: Number,
      default: 24,
    },
    minWidth: {
      type: Number,
      default: FLEX_CARD_MIN_WIDTH,
    },
    maxWidth: {
      type: Number,
      default: FLEX_CARD_MAX_WIDTH,
    },
  },

  computed: {
    cssProps(): CssProps {
      return {
        '--margin': `${this.margin}px`,
        '--min-width': `${this.minWidth}px`,
        '--max-width': `${this.maxWidth}px`,
      };
    },
  },
});
</script>

<style lang="scss" module>
.CardsWrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  // card のみに適用
  & > *:not(&__spacer) {
    flex: 1 0 var(--min-width);
    // 左右と下のマージン
    margin: 0 calc(var(--margin) / 2) var(--margin);
    min-width: var(--min-width);
    max-width: var(--max-width);
  }

  // 最終行の余りの部分を埋める
  &__spacer {
    flex: 1 0 var(--min-width);
    // 左右のマージンのみ
    margin: 0 calc(var(--margin) / 2);
    min-width: var(--min-width);
    max-width: var(--max-width);
    height: 0;
  }
}
</style>
