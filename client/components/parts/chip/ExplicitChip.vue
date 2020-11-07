<template>
  <v-chip
    label
    x-small
    title="露骨な表現を含む"
    :class="$style.ExplicitChip"
  >
    E
  </v-chip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
</script>

<style lang="scss" module>
.ExplicitChip {
  padding: 0 6px;
}
</style>
