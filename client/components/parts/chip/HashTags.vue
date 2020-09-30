<template>
  <div
    v-if="tagList.length > 0"
    :class="$style.HashTags"
  >
    <template v-for="tag in tagList">
      <v-chip
        v-if="tag"
        :key="tag"
        small
        :color="color"
        :text-color="textColor"
        :outlined="outlined"
        :title="`# ${tag.toUpperCase()}`"
      >
        # {{ tag.toUpperCase() }}
      </v-chip>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    tagList: {
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
