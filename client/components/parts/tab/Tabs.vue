<template>
  <div>
    <v-tabs
      v-model="tab"
      color="active"
      :mobile-breakpoint="0"
      :show-arrows="false"
      :height="32"
      :background-color="backgroundColor"
    >
      <v-tab
        v-for="item in items"
        :key="item.title"
        nuxt
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
}

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    divider: {
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
.v-slide-group {
  @include side-gradation();

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
</style>
