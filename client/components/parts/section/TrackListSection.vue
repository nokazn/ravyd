<template>
  <section :class="$style.TrackListSection">
    <h2>
      {{ title }}
    </h2>

    <slot />

    <div
      v-if="value != null"
      :class="$style.TrackListSection__footer"
    >
      <ShowAllButton
        v-model="all"
        small
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ShowAllButton, { On as OnShowAll, INPUT } from '~/components/parts/button/ShowAllButton.vue';

export type On = {
  [INPUT]: OnShowAll['input'];
}

export default Vue.extend({
  components: {
    ShowAllButton,
  },

  props: {
    value: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    title: {
      type: String,
      required: true,
    },
  },

  computed: {
    all: {
      get(): boolean | undefined {
        return this.value;
      },
      set(all: OnShowAll['input']) {
        this.$emit(INPUT, all);
      },
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
