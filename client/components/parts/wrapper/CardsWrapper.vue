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
import Vue, { PropType } from 'vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/constants';

export default Vue.extend({
  props: {
    margin: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    minWidth: {
      type: Number,
      // $constant では参照できない
      default: FLEX_CARD_MIN_WIDTH,
    },
    maxWidth: {
      type: Number,
      // $constant では参照できない
      default: FLEX_CARD_MAX_WIDTH,
    },
  },

  computed: {
    cssProps(): Record<string, string> {
      const margin = this.margin ?? this.minWidth / 8;
      return {
        '--margin': `${margin}px`,
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
  justify-content: space-between;
  flex-wrap: wrap;

  // card のみに適用
  & > *:not(&__spacer) {
    flex: 1 0 var(--min-width);
    // 左右と下のマージン
    margin: 0 max(calc(var(--margin) / 2), 8px) max(var(--margin), 16px);
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
