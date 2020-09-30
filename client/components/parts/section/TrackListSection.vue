<template>
  <section :class="$style.TrackListSection">
    <h2>
      {{ title }}
    </h2>

    <slot />

    <div
      v-if="isAbbreviated != null"
      :class="$style.TrackListSection__footer"
    >
      <ShowAllButton
        small
        :is-abbreviated="isAbbreviated"
        @on-clicked="onShowAllButtonClicked"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: boolean
}

export default Vue.extend({
  components: {
    ShowAllButton,
  },

  props: {
    isAbbreviated: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    title: {
      type: String,
      required: true,
    },
  },

  methods: {
    onShowAllButtonClicked() {
      const nextIsAbbreviated = !this.isAbbreviated;
      this.$emit(ON_CLICKED, nextIsAbbreviated);
    },
  },
});
</script>

<style lang="scss" module>
.TrackListSection {
  &__footer {
    display: flex;
    justify-content: center;
  }
}
</style>
