<template>
  <div :class="$style.HashTags">
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
    margin-bottom: 2px;
    margin-right: 4px;
    font-size: 10px !important;
  }
}
</style>
