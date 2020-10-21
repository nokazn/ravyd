import { watchEffect, Ref, onBeforeUnmount } from '@vue/composition-api';

export const useIntersectionObserver = (
  elementRef: Ref<HTMLElement | undefined | null>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
) => {
  let observer: IntersectionObserver | undefined;
  const stop = watchEffect((onInvalidate) => {
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(callback);
      }, options);
      const element = elementRef.value;
      if (element != null) {
        observer.observe(element);
      }
    }

    onInvalidate(() => {
      if (observer != null) {
        observer.disconnect();
      }
    });
  });

  onBeforeUnmount(() => {
    stop();
  });

  return stop;
};
