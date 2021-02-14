<template>
  <TextInfo
    :size="size"
    :icon="icon"
    :subtext="subtext"
    :title="title"
  >
    <template #icon>
      mdi-album
    </template>

    {{ label }}
  </TextInfo>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import TextInfo from '~/components/parts/text/TextInfo.vue';

export default defineComponent({
  components: {
    TextInfo,
  },

  props: {
    label: {
      type: String,
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
    const title = `レーベル - ${props.label}`;
    return { title };
  },
});
</script>
