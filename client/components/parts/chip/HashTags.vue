<template>
  <div :class="$style.HashTags">
    <template v-for="tag in tagList">
      <v-chip
        v-if="tag != null"
        :key="tag"
        small
        outlined
        text-color="subtext"
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
