<template>
  <div :class="$style.ReleaseName">
    <nuxt-link
      v-if="releasesPath != null"
      :to="releasesPath">
      {{ name }}
    </nuxt-link>
    <span v-else>
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    releaseId: {
      required: true,
      validator(value) {
        return typeof value === 'string' || value == null;
      },
    },
  },

  computed: {
    releasesPath(): string | null {
      return this.releaseId != null
        ? `/releases/${this.releaseId}`
        : null;
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
