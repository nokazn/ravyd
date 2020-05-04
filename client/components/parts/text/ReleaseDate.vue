<template>
  <span :class="$style.ReleaseDate">
    <v-icon
      :size="size"
      color="grey lighten-1">
      mdi-calendar
    </v-icon>
    <span :style="textStyles">
      {{ date }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type Data = {
  date: string
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
    // releaseDate のフォーマットと date のフォーマットの配列
    const releaseDateFormat = {
      year: ['YYYY', 'YYYY年'] as const,
      month: ['YYYY-MM', 'YYYY年M月'] as const,
      day: ['YYYY-MM-dd', 'YYYY年M月d日'] as const,
    }[this.releaseDatePrecision];
    const date = this.$dayjs(this.releaseDate, releaseDateFormat[0]).format(releaseDateFormat[1]);

    return {
      date,
    };
  },

  computed: {
    textStyles(): { 'font-size': string } {
      return {
        'font-size': `${this.size * 0.8}px`,
      };
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseDate {
  color: $g-subtitle-color;
}
</style>
