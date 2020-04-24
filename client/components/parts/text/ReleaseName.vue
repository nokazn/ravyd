<template>
  <div :class="$style.ReleaseName">
    <nuxt-link :to="releasesPath">
      {{ name }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export type Releases = {
  name: string
  releaseId: string
}

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
  },

  computed: {
    releasesPath(): string {
      return `/releases/${this.releaseId}`;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseName {
  color: $g-title-color;
  font-size: 0.8rem;
  line-height: 1rem;
  padding: 8px;
}
</style>
