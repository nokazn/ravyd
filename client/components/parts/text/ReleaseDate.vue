<template>
  <span
    :title="title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="iconSize"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-calendar
    </v-icon>
    <time
      :datetime="datetime"
      :style="textStyles"
    >
      {{ date }}
    </time>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { convertReleaseDate } from '~/services/converter';

export default defineComponent({
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
    releaseDatePrecision: {
      type: String as PropType<'year' | 'month' | 'day'>,
      required: true,
    },
    size: {
      type: Number,
      default: 13,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const date = convertReleaseDate({
      releaseDate: props.releaseDate,
      releaseDatePrecision: props.releaseDatePrecision,
    });
    const title = `${date}リリース`;
    const textStyles = { fontSize: `${props.size}px` };
    const iconSize = Math.floor(props.size * 1.25);

    return {
      date,
      title,
      datetime: props.releaseDate,
      textStyles,
      iconSize,
    };
  },
});
</script>
