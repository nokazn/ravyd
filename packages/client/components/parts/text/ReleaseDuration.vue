<template>
  <TextInfo
    :size="size"
    :icon="icon"
    :subtext="subtext"
    :title="duration.title"
  >
    <template #icon>
      mdi-clock-outline
    </template>

    {{ duration.text }}
  </TextInfo>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { elapsedTimeInJapanese } from 'shared/utils';
import TextInfo from '~/components/parts/text/TextInfo.vue';

type Duration = {
  text: string;
  title: string;
};

export default defineComponent({
  components: {
    TextInfo,
  },

  props: {
    durationMs: {
      type: Number,
      required: true,
    },
    hasMore: {
      type: Boolean,
      default: false,
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
    const duration = computed<Duration>(() => {
      const elapsedTime = elapsedTimeInJapanese(props.durationMs);
      const text = props.hasMore
        ? `${elapsedTime} + α`
        : elapsedTime;
      return {
        text,
        title: `全${text}`,
      };
    });

    return { duration };
  },
});
</script>
