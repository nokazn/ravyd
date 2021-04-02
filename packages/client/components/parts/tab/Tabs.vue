<template>
  <div
    class="Tabs"
    :class="{ shadow }"
  >
    <v-tabs
      v-model="tab"
      color="active"
      :mobile-breakpoint="0"
      :show-arrows="false"
      :height="height"
      :background-color="backgroundColor"
    >
      <v-tab
        v-for="item in items"
        :key="item.title"
        nuxt
        exact
        :to="item.to"
        @click.native.stop
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-divider v-if="divider" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';

export type Item = {
  title: string;
  to: string;
};

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    height: {
      type: Number,
      default: 32,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    divider: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    const tab = ref<number | null>(null);
    const backgroundColor = props.transparent
      ? 'transparent'
      : root.$constant.BACKGROUND_COLOR;

    return {
      tab,
      backgroundColor,
    };
  },
});
</script>

<style lang="scss">
.Tabs {
  .v-slide-group {
    &__prev,
    &__next {
      display: none;
    }

    &__wrapper {
      @include no-scroll-bar();

      overflow-x: auto;
      overflow-y: hidden;
      touch-action: auto;
    }

    &__content {
      transform: translateX(0) !important;
    }
  }

  &.shadow {
    @include side-gradation();

    margin-left: calc(#{$g-gradation-width} * -1);
    margin-right: calc(#{$g-gradation-width} * -1);

    .v-slide-group__content {
      padding: 0 $g-gradation-width;
    }

    .v-divider {
      margin: 0 $g-gradation-width;
    }
  }
}
</style>
