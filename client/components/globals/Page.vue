<template>
  <div>
    <div :class="$style.Spacer" />
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend();
</script>

<style lang="scss" module>
// .Page {
//   overflow-y: scroll;
//   height: calc(100vh - #{$g-footer-height});
// }

.Spacer {
  height: $g-header-height;
}
</style>
