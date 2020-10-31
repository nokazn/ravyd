<template>
  <div>
    <client-only>
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
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-divider v-if="divider" />
    </client-only>
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
    overflow-x: auto;
    overflow-y: hidden;
    touch-action: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
