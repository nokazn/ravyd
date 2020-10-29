<template>
  <TextInfo
    :size="size"
    :icon="icon"
    :subtext="subtext"
    :title="title"
  >
    <template #icon>
      mdi-music-box-multiple-outline
    </template>

    {{ text }}
  </TextInfo>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import TextInfo from '~/components/parts/text/TextInfo.vue';

export default defineComponent({
  components: {
    TextInfo,
  },

  props: {
    total: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '曲',
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
    const text = computed(() => `${props.total}${props.unit}`);
    const title = computed(() => `全${text.value}`);
    return {
      text,
      title,
    };
  },
});
</script>
