<template>
  <section :class="$style.CardSection">
    <div :class="$style.CardSection__header">
      <h2>
        {{ title }}
      </h2>

      <div @mouseover="onButtonHovered">
        <ShowAllButton
          v-if="value != null"
          v-model="all"
          small
        />
      </div>
    </div>

    <v-divider :class="$style.CardSection__divider" />

    <CardsWrapper
      :margin="margin"
      :min-width="minWidth"
      :max-width="maxWidth"
    >
      <slot />
    </CardsWrapper>

    <IntersectionLoadingCircle
      v-if="value"
      :loading="!full"
      :class="$style.CardSection__loadingCircle"
      @appear="onLoadingAppeared"
    />

    <div
      v-if="value != null"
      :class="$style.CardSection__footer"
      @mouseover="onButtonHovered"
    >
      <ShowAllButton v-model="all" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import ShowAllButton, { On as OnShowAll, INPUT } from '~/components/parts/button/ShowAllButton.vue';

const ON_BUTTON_HOVERED = 'on-button-hovered';
const ON_LOADING_APPEARED = 'on-loading-appeared';

export type On = {
  [INPUT]: OnShowAll['input'];
  [ON_BUTTON_HOVERED]: void;
  [ON_LOADING_APPEARED]: void;
}

export default Vue.extend({
  components: {
    CardsWrapper,
    IntersectionLoadingCircle,
    ShowAllButton,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    full: {
      type: Boolean,
      required: true,
    },
    margin: {
      type: Number,
      default: undefined,
    },
    minWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    maxWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
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

  methods: {
    onButtonHovered() {
      // 省略表示されているときにホバーした場合のみ emit
      if (!this.value) {
        this.$emit(ON_BUTTON_HOVERED);
      }
    },
    onLoadingAppeared() {
      this.$emit(ON_LOADING_APPEARED);
    },
  },
});
</script>

<style lang="scss" module>
.CardSection {
  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__divider {
    margin: 4px 0 16px;
  }

  &__loadingCircle {
    margin-bottom: 16px;
  }

  &__footer {
    display: flex;
    justify-content: center;
  }
}
</style>
