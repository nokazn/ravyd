<template>
  <span
    :class="{ ['subtext--text']: subtext }"
    :style="icon ? undefined : textStyles"
  >
    <template v-if="icon">
      <v-icon
        :size="iconSize"
        :color="subtext ? 'subtext' : undefined"
      >
        <slot name="icon" />
      </v-icon>
      <component
        :is="tag || 'span'"
        v-bind="props"
        :style="textStyles"
      >
        <slot />
      </component>
    </template>

    <template v-else>
      <slot />
    </template>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  props: {
    tag: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    props: {
      type: Object as PropType<Record<string, string> | undefined>,
      default: undefined,
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
    const textStyles = props.size != null
      ? { fontSize: `${props.size}px` }
      : undefined;
    const iconSize = props.size != null
      ? Math.floor(props.size * 1.25)
      : undefined;

    return {
      textStyles,
      iconSize,
    };
  },
});
</script>
