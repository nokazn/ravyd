<template>
  <div :class="$style.SeekBar">
    <v-slider
      dense
      hide-details
      :color="color"
      :thumb-color="thumbColor"
      :disabled="disabled"
      :max="durationMs"
      :value="positionMs"
      :class="$style.SeekBar__slider"
      :style="cssProps"
      @mousedown="onMouseDown"
      @change="onChange"
    />

    <div
      v-if="!hideText"
      :class="$style.SeekBar__mss"
    >
      <span :class="$style['SeekBar__mss--left']">
        {{ positionMss }}
      </span>
      <span
        :title="durationMsTitle"
        :class="$style['SeekBar__mss--right']"
      >
        {{ durationMss }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { useSeekBar } from '~/use/player';

export default defineComponent({
  props: {
    hideText: {
      type: Boolean,
      default: false,
    },
    thumbColor: {
      type: String,
      default: 'white',
    },
  },

  setup(props, { root }) {
    const {
      positionMs,
      positionMss,
      durationMs,
      durationMss,
      durationMsTitle,
      color,
      disabled,
      onMouseDown,
      onChange,
    } = useSeekBar(root);

    const cssProps = computed(() => ({
      '--margin-side': props.thumbColor === 'transparent'
        ? '0'
        : '8px',
    }));

    return {
      positionMs,
      positionMss,
      durationMs,
      durationMss,
      durationMsTitle,
      disabled,
      color,
      cssProps,
      onMouseDown,
      onChange,
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
