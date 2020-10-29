import Vue from 'vue';
import {
  onMounted,
  onBeforeUnmount,
  Ref,
  SetupContext,
} from '@vue/composition-api';

type VTextFieldRef = {
  focus(): void;
  blur(): void;
}

export const useTextField = (
  root: SetupContext['root'],
  key: string,
  elementRef: Ref<Vue | null | undefined>,
) => {
  onMounted(() => {
    if (elementRef.value != null) {
      const element = elementRef.value as Vue & VTextFieldRef;

      root.$keyboard.add(key, (e: KeyboardEvent) => {
        switch (e.key) {
          case '/':
            // @todo
            setTimeout(() => {
              element.focus();
            }, 0);
            break;
          case 'Escape':
            setTimeout(() => {
              element.blur();
            }, 0);
            break;
          default:
            break;
        }
      });
    }
  });

  const stop = () => { root.$keyboard.remove(key); };

  onBeforeUnmount(() => {
    stop();
  });

  return stop;
};
