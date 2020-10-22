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
import { defineComponent, computed, PropType } from '@vue/composition-api';

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

export default defineComponent({
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

  setup(props, { emit }) {
    const all = computed<boolean | undefined>({
      get() { return props.value; },
      // @todo undefined は除外できる
      set(value) { emit(INPUT, value); },
    });
    const onButtonHovered = () => {
      // 省略表示されているときにホバーした場合のみ emit
      if (props.value === false) {
        emit(ON_BUTTON_HOVERED);
      }
    };
    const onLoadingAppeared = () => { emit(ON_LOADING_APPEARED); };

    return {
      all,
      onButtonHovered,
      onLoadingAppeared,
    };
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
