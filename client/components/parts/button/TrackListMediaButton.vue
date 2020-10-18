<template>
  <span :class="$style.TrackListMediaButton">
    <template v-if="!disabled">
      <CircleButton
        v-show="hover"
        outlined
        :size="size"
        :icon-size="iconSize"
        :title="button.title"
        @click="onClick"
      >
        {{ button.icon }}
      </CircleButton>
      <v-icon
        v-show="!hover && value"
        :size="iconSize"
        title="再生中"
      >
        mdi-volume-high
      </v-icon>
      <span v-show="!hover && !value">
        {{ trackNumber }}
      </span>
    </template>

    <span
      v-else
      title="再生できない項目"
      class="inactive--text"
    >
      {{ trackNumber }}
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type Button = {
  icon: 'mdi-play' | 'mdi-pause';
  title: '再生' | '停止';
}

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    hover: {
      type: Boolean,
      required: true,
    },
    trackNumber: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    size: {
      type: Number,
      default: 28,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    [INPUT]: (_value: boolean) => true,
  },

  setup(props, { emit }) {
    const button = computed((): Button => {
      return props.value
        ? {
          icon: 'mdi-pause',
          title: '停止',
        }
        : {
          icon: 'mdi-play',
          title: '再生',
        };
    });
    const iconSize = computed(() => Math.floor(props.size * 0.9));
    const onClick = () => { emit(INPUT, !props.value); };

    return {
      button,
      iconSize,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.TrackListMediaButton {
  display: inline-flex;
  justify-content: center;
  min-width: 28px;
}
</style>
