import {
  computed,
  onMounted,
  onBeforeUnmount,
  SetupContext,
} from '@vue/composition-api';
import { ExtendedMutationPayload } from 'typed-vuex';
import { elapsedTime } from '~~/utils/elapsedTime';

export const useSeekBar = (root: SetupContext['root']) => {
  const positionMs = computed(() => root.$state().playback.positionMs);
  // @todo this.value が undefined になるときがある
  const positionMss = computed(() => {
    const min = Math.floor((positionMs.value ?? 0) / 1000 / 60).toString();
    const sec = Math.floor(((positionMs.value ?? 0) / 1000) % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  });

  const durationMs = computed(() => root.$state().playback.durationMs);
  const durationMss = computed(() => elapsedTime(durationMs.value));
  const durationMsTitle = computed(() => {
    return durationMs.value === root.$constant.DEFAULT_DURATION_MS
      ? '再生時間が取得できません'
      : undefined;
  });

  const progress = computed(() => {
    return (root.$state().playback.positionMs / root.$state().playback.durationMs) * 100;
  });

  const isPlaying = computed(() => root.$state().playback.isPlaying);
  // durationMs が不適な値の場合もシークバーを操作できないようにするs
  const disabled = computed(() => root.$getters()['playback/isDisallowed']('seeking')
    || durationMs.value === root.$constant.DEFAULT_DURATION_MS);

  const color = computed(() => {
    return isPlaying.value
      ? 'active-icon'
      : 'grey lighten-2';
  });

  let timer: ReturnType<typeof setInterval> | undefined;
  const clearTimer = () => {
    if (timer != null) {
      clearInterval(timer);
      timer = undefined;
    }
  };
  const updatePosition = () => {
    const intervalMs = 500;
    clearTimer();
    timer = setInterval(() => {
      // this.value += intervalMs;
      const currentPositionMs = root.$state().playback.positionMs;
      root.$commit('playback/SET_POSITION_MS', currentPositionMs + intervalMs);
      // 1000ms 以内かどうかの情報がストアと異なる場合は更新
      const isBeginning = currentPositionMs <= 1000;
      if (isBeginning !== root.$state().playback.disabledPlayingFromBeginning) {
        root.$commit('playback/SET_DISABLED_PLAYING_FROM_BEGINNING', isBeginning);
      }
    }, intervalMs);
  };

  const onMouseDown = () => { clearTimer(); };
  const onChange = async (p: number) => {
    const currentPositionMs = root.$state().playback.positionMs;
    root.$commit('playback/SET_POSITION_MS', p);
    await root.$dispatch('playback/seek', {
      positionMs: p,
      currentPositionMs,
    }).then(() => {
      if (isPlaying.value) {
        updatePosition();
      }
    });
  };

  let mutationUnsubscribe: (() => void) | undefined;
  onMounted(() => {
    if (isPlaying.value) updatePosition();
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
    positionMs,
    positionMss,
    durationMs,
    durationMss,
    durationMsTitle,
    progress,
    isPlaying,
    disabled,
    color,
    onMouseDown,
    onChange,
  };
};
