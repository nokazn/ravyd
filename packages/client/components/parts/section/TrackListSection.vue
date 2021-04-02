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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import ShowAllButton, { On as OnShowAll, INPUT } from '~/components/parts/button/ShowAllButton.vue';

export type On = {
  [INPUT]: OnShowAll['input'];
};

export default defineComponent({
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

  setup(props, { emit }) {
    const all = computed<boolean | undefined>({
      get() { return props.value; },
      // TODO: undefined は除外できる
      set(value) { emit(INPUT, value); },
    });
    return { all };
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
