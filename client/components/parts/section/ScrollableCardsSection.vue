<template>
  <section :class="$style.ScrollableCardSection">
    <h2
      :class="$style.ScrollableCardSection__title"
      v-text="title"
    />
    <v-divider :class="$style.ScrollableCardSection__divider" />
    <scrollable-cards-wrapper :class="$style.ScrollableCardSection__cardContainer">
      <slot />
    </scrollable-cards-wrapper>
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
    margin-left: 40px;
    margin-bottom: 6px;
  }
  &__divider {
    margin: 0 40px 16px;
  }
}
</style>
