<template>
  <span
    :title="title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="size * 1.25"
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
import Vue, { PropType } from 'vue';
import { convertReleaseDate } from '~/utils/converter';

export type Data = {
  date: string
  datetime: string
  title: string
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
    releaseDatePrecision: {
      type: String as PropType<'year' | 'month' | 'day'>,
      required: true,
      validator(value) {
        return ['year', 'month', 'day'].some((ele) => ele === value);
      },
    },
    size: {
      type: Number,
      default: 12,
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

  data(): Data {
    const { releaseDate, releaseDatePrecision } = this;
    const date = convertReleaseDate({
      releaseDate,
      releaseDatePrecision,
    });
    const title = `${date}リリース`;
    const textStyles = { fontSize: `${this.size}px` };
    return {
      date,
      datetime: releaseDate,
      title,
      textStyles,
    };
  },
});
</script>
