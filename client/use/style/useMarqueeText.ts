import Vue from 'vue';
import { ref, computed, Ref } from '@vue/composition-api';
import { sleep } from '~~/utils/sleep';

export const useMarqueeText = (elementRef: Ref<HTMLElement | Vue | undefined | null>) => {
  let animationTimeoutId: ReturnType<typeof setTimeout> | undefined;

  const isHovered = ref(false);
  const parentWidth = ref<number>();
  const elementWidth = ref<number>();

  const marqueeSeconds = computed<number | undefined>(() => {
    if (!isHovered.value
      || parentWidth.value == null
      || elementWidth.value == null
      || elementWidth.value < parentWidth.value * 0.95) return undefined;
    const widthPerSeconds = 30;
    return Math.ceil((elementWidth.value / widthPerSeconds));
  });

  const marqueeStyles = computed(() => {
    return marqueeSeconds.value != null
      ? { animation: `marquee ${marqueeSeconds.value}s linear 1` }
      : undefined;
  });

  const calculateWidth = () => {
    const element = elementRef.value != null && '$el' in elementRef.value
      ? elementRef.value.$el
      : elementRef.value;
    if (element == null) return;
    elementWidth.value = element.clientWidth;
    parentWidth.value = element.parentElement?.clientWidth;
  };

  const onHovered = async () => {
    calculateWidth();
    // 既にアニメーションがスタートしてる場合はキャンセル
    if (isHovered.value) return;

    isHovered.value = true;
    // ホバーしてから0.5秒後にアニメーションを開始
    const extraMillSeconds = 500;
    await sleep(extraMillSeconds);
    if (marqueeSeconds.value == null) {
      isHovered.value = false;
      return;
    }
    // アニメーション終了後に再度アニメーションを受け付けられる状態にする
    animationTimeoutId = setTimeout(() => {
      isHovered.value = false;
    }, marqueeSeconds.value * 1000 + extraMillSeconds);
  };

  const resetTimer = () => {
    if (animationTimeoutId != null) {
      clearTimeout(animationTimeoutId);
    }
    animationTimeoutId = undefined;
    isHovered.value = false;
  };

  return {
    marqueeStyles,
    calculateWidth,
    onHovered,
    resetTimer,
  };
};
