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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/constants';

export default defineComponent({
  props: {
    margin: {
      type: Number as PropType<number | undefined>,
      default: undefined,
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

  setup(props) {
    const cssProps = computed(() => ({
      '--margin': `${(props.margin ?? props.minWidth) / 8}px`,
      '--min-width': `${props.minWidth}px`,
      '--max-width': `${props.maxWidth}px`,
    }));
    return { cssProps };
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
