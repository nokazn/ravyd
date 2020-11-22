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
      rounded
      nuxt
      :to="custom ? undefined : to"
      :color="$constant.CARD_BACKGROUND_COLOR"
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
          v-if="!hideSubtitle"
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

export default defineComponent({
  props: {
    to: {
      type: [String, Object] as PropType<RawLocation>,
      required: true,
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
    custom: {
      type: Boolean,
      default: false,
    },
    hideSubtitle: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    const isLoaded = useIsLoaded();
    const onClick = () => {
      if (props.custom) {
        root.$router.push(props.to);
      }
    };

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
