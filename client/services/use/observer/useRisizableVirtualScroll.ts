import {
  ref,
  watchEffect,
  onBeforeUnmount,
  SetupContext,
  Ref,
  unref,
} from '@vue/composition-api';

export const useResizableVirtualScroll = (
  root: SetupContext['root'],
  elementRef: Ref<HTMLElement | undefined | null>,
) => {
  const virtualScrollerHeight = ref(0);

  const calculateVirtualScrollerHeight = (height: number) => {
    root.$nextTick().then(() => {
      virtualScrollerHeight.value = Math.max(Math.floor(height), 0);
    });
  };

  let resizeObserver: ResizeObserver | undefined;
  const stop = watchEffect((onInvalidate) => {
    const rawElement = unref(elementRef);
    if (rawElement != null && typeof ResizeObserver !== 'undefined') {
      calculateVirtualScrollerHeight(rawElement.clientHeight);
      // re-calculate when resize events are detected
      resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          calculateVirtualScrollerHeight(entry.contentRect.height);
        });
      });
      resizeObserver.observe(rawElement);
    }

    onInvalidate(() => {
      if (resizeObserver != null) {
        resizeObserver.disconnect();
      }
    });
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    virtualScrollerHeight,
  };
};
