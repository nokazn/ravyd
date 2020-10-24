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
      mdi-music-box-multiple-outline
    </v-icon>
    <span :style="textStyles">
      {{ text }}
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
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
    const textStyles = { fontSize: `${props.size}px` };
    const iconSize = Math.floor(props.size * 1.25);
    const text = computed(() => `${props.total}${props.unit}`);
    const title = computed(() => `全${text.value}`);

    return {
      textStyles,
      iconSize,
      text,
      title,
    };
  },
});
</script>
