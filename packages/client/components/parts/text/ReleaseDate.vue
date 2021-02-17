<template>
  <TextInfo
    tag="time"
    :props="{ datetime }"
    :size="size"
    :icon="icon"
    :subtext="subtext"
    :title="title"
  >
    <template #icon>
      mdi-calendar
    </template>

    {{ date }}
  </TextInfo>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import TextInfo from '~/components/parts/text/TextInfo.vue';
import { convertReleaseDate } from '~/services/converter';

export default defineComponent({
  components: {
    TextInfo,
  },

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
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    subtext: {
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
    const datetime = props.releaseDate;

    return {
      date,
      title,
      datetime,
    };
  },
});
</script>
