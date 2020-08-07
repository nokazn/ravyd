<template>
  <section :class="$style.CardSection">
    <div :class="$style.CardSection__header">
      <h2>
        {{ title }}
      </h2>

      <ShowAllButton
        v-if="isAbbreviated != null"
        small
        :is-abbreviated="isAbbreviated"
        @on-clicked="onButtonClicked"
        @mouseenter.native="onButtonHovered"
      />
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
      v-if="isAbbreviated === false"
      :is-loading="!isFull"
      :class="$style.CardSection__loadingCircle"
      @on-appeared="onLoadingAppeared"
    />

    <div
      v-if="isAbbreviated != null"
      :class="$style.CardSection__footer"
    >
      <ShowAllButton
        :is-abbreviated="isAbbreviated"
        @on-clicked="onButtonClicked"
        @mouseenter.native="onButtonHovered"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';

const ON_BUTTON_CLICKED = 'on-button-clicked';
const ON_BUTTON_HOVERED = 'on-button-hovered';
const ON_LOADING_APPEARED = 'on-loading-appeared';

export type On = {
  [ON_BUTTON_CLICKED]: boolean
  [ON_BUTTON_HOVERED]: void
  [ON_LOADING_APPEARED]: void
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
    isAbbreviated: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    isFull: {
      type: Boolean,
      required: true,
    },
    margin: {
      type: Number,
      default: 32,
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

  methods: {
    onButtonClicked() {
      const nextIsAbbreviated = !this.isAbbreviated;
      this.$emit(ON_BUTTON_CLICKED, nextIsAbbreviated);
    },
    onButtonHovered() {
      // 省略表示されているときにホバーした場合のみ emit
      if (this.isAbbreviated) {
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
    margin: 6px 0 16px;
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
