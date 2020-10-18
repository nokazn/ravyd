<template>
  <div
    v-if="tags.length > 0"
    :class="$style.HashTags"
  >
    <template v-for="tag in tags">
      <v-chip
        v-if="tag"
        :key="tag"
        small
        :color="color"
        :text-color="textColor"
        :outlined="outlined"
        :title="toUpperCase(tag)"
      >
        {{ toUpperCase(tag) }}
      </v-chip>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  props: {
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
    color: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    textColor: {
      type: String,
      default: 'subtext',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const toUpperCase = (tag: string) => `# ${tag.toUpperCase()}`;
    return {
      toUpperCase,
    };
  },
});
</script>

<style lang="scss" module>
.HashTags {
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 0.3em;
    font-size: 0.6em !important;
  }

  & > *:not(:last-child) {
    margin-right: 0.6em;
  }
}
</style>
