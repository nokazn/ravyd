<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="card"
      boilerplate
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
    />
    <v-card
      v-else
      hover
      ripple
      nuxt
      rounded
      :color="$constant.CARD_BACKGROUND_COLOR"
      :to="to"
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
      :class="$style.Card"
      @click="onClick"
    >
      <div :class="$style.Card__container">
        <slot name="image" />

        <v-card-title :class="$style.Card__title">
          <slot name="title" />
        </v-card-title>

        <v-card-subtitle
          v-if="!onlyTitle"
          :class="$style.Card__subtitle"
        >
          <slot name="subtitle" />
        </v-card-subtitle>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { RawLocation } from 'vue-router';
import { useIsLoaded } from '~/use/util';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
}

export default defineComponent({
  props: {
    to: {
      type: [String, Object] as PropType<RawLocation | undefined>,
      default: undefined,
    },
    width: {
      type: Number as PropType<number | undefined>,
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
    onlyTitle: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    [CLICK]: null,
  },

  setup(_, { emit }) {
    const isLoaded = useIsLoaded();
    const onClick = () => { emit(CLICK); };

    return {
      isLoaded,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.Card {
  &__container {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 0.9em;
    line-height: 1.4em;
    padding: 12px 6%  6% !important;
  }

  &__subtitle {
    font-size: 0.825em;
    line-height: 1.3em;
    margin-top: -8% !important;
    padding: 6% 6% 12px !important;
  }
}
</style>
