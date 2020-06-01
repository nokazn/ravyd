<template>
  <section :class="$style.CardSection">
    <h2 v-text="title" />
    <v-divider :class="$style.CardSection__divider" />
    <div>
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.CardSection {
  &__divider {
    margin: 6px 0 16px;
  }
}
</style>
