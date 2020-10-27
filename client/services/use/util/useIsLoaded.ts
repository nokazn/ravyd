import { ref, onMounted } from '@vue/composition-api';

export const useIsLoaded = () => {
  const isLoaded = ref(false);

  onMounted(() => {
    isLoaded.value = true;
  });

  return isLoaded;
};
