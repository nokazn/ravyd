<template>
  <v-progress-linear
    :height="height"
    color="active-icon"
    :background-color="backgroundColor"
    :value="value"
    :class="$style.SeekBar__slider"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from '@vue/composition-api';
import { ExtendedMutationPayload } from 'typed-vuex';

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 2,
    },
    backgroundColor: {
      type: String,
      default: 'white',
    },
  },

  setup(_, { root }) {
    const value = computed<number>(() => {
      return (root.$state().playback.positionMs / root.$state().playback.durationMs) * 100;
    });
    const isPlaying = computed(() => root.$state().playback.isPlaying);
    const durationMs = computed(() => root.$state().playback.durationMs);
    const disabledPlayingFromBegining = computed(
      () => root.$state().playback.disabledPlayingFromBegining,
    );

    const timer = ref<ReturnType<typeof setInterval>>();
    const updatePosition = () => {
      const intervalMs = 500;
      if (timer.value != null) {
        clearInterval(timer.value);
      }
      timer.value = setInterval(() => {
        root.$commit('playback/SET_POSITION_MS', root.$state().playback.positionMs + intervalMs);
        // 1000ms 以内かどうかの情報がストアと異なる場合は更新
        const localDisabledPlayingFromBegining = value.value <= 1000;
        if (localDisabledPlayingFromBegining !== disabledPlayingFromBegining.value) {
          root.$commit('playback/SET_DISABLED_PLAYING_FROM_BEGINING', localDisabledPlayingFromBegining);
        }
      }, intervalMs);
    };

    const clearTimer = () => {
      if (timer.value != null) {
        clearInterval(timer.value);
        timer.value = undefined;
      }
    };

    let mutationUnsubscribe: (() => void) | undefined;
    onMounted(() => {
      if (isPlaying.value) {
        updatePosition();
      }

      const subscribeIsPlaying = ({ payload }: ExtendedMutationPayload<'playback/SET_IS_PLAYING'>) => {
        if (payload) {
          updatePosition();
        } else {
          clearTimer();
        }
      };
      mutationUnsubscribe = root.$subscribe((mutation) => {
        const { type } = mutation;
        switch (type) {
          case 'playback/SET_IS_PLAYING':
            subscribeIsPlaying(mutation as ExtendedMutationPayload<typeof type>);
            break;
          default:
            break;
        }
      });
    });

    onBeforeUnmount(() => {
      clearTimer();
      if (mutationUnsubscribe != null) {
        mutationUnsubscribe();
        mutationUnsubscribe = undefined;
      }
    });

    return {
      value,
      updatePosition,
      durationMs,
    };
  },
});
</script>

<style lang="scss" module>
.SeekBar {
  width: 100%;

  &__mss {
    font-size: 0.75em;
    margin-top: -0.5em;
    position: relative;

    & > * {
      position: absolute;
    }

    &--right {
      right: 0;
    }
  }
}
</style>

<style lang="scss">
.v-slider {
  &--horizontal {
    margin-left: var(--margin-side) !important;
    margin-right: var(--margin-side) !important;
  }
}
</style>
