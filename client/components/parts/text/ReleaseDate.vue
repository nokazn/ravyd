<template>
  <span
    :title="title"
    class="subtext--text"
  >
    <v-icon
      :size="size"
      color="subtext"
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
      default: 16,
    },
  },

  data(): Data {
    const { releaseDate, releaseDatePrecision } = this;
    const date = convertReleaseDate({
      releaseDate,
      releaseDatePrecision,
    });
    const title = `${date}リリース`;
    const textStyles = {
      fontSize: `${this.size * 0.8}px`,
    };

    return {
      date,
      datetime: releaseDate,
      title,
      textStyles,
    };
  },
});
</script>
