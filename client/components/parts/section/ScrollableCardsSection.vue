<template>
  <section :class="$style.ScrollableCardSection">
    <h2 :class="$style.ScrollableCardSection__title">
      {{ title }}
    </h2>

    <v-divider :class="$style.ScrollableCardSection__divider" />

    <ScrollableCardsWrapper>
      <slot />
    </ScrollableCardsWrapper>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import ScrollableCardsWrapper from '~/components/parts/wrapper/ScrollableCardsWrapper.vue';


export default Vue.extend({
  components: {
    ScrollableCardsWrapper,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.ScrollableCardSection {
  &__title {
    @include scrollable-card-wrapper-side-margin();

    margin-bottom: 4px;
  }

  &__divider {
    @include scrollable-card-wrapper-side-margin();

    margin-bottom: 12px;
  }
}
</style>
