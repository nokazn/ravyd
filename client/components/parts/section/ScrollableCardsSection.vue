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
import { defineComponent } from '@vue/composition-api';
import ScrollableCardsWrapper from '~/components/parts/wrapper/ScrollableCardsWrapper.vue';

export default defineComponent({
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
@mixin scrollable-cards-wrapper-side-margin($ratio: 1) {
  margin: {
    right: calc(#{$g-gradation-width} * #{$ratio});
    left: calc(#{$g-gradation-width} * #{$ratio});
  }
}

.ScrollableCardSection {
  &__title {
    @include scrollable-cards-wrapper-side-margin();

    margin-bottom: 4px;
  }

  &__divider {
    @include scrollable-cards-wrapper-side-margin();

    margin-bottom: 12px;
  }
}
</style>
