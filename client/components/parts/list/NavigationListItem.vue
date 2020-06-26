<template>
  <v-list-item
    link
    nuxt
    :to="to"
    :title="name"
    dense
    :class="{
      [$style['NavigationListItem--dense']]: dense,
      'g-no-text-decoration': true,
    }"
    class="g-no-text-decoration"
  >
    <v-list-item-icon v-if="icon != null">
      <v-icon :title="name">
        {{ icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title
        :class="{
          [$style.NavigationListItem__title]: true,
          'active--text': isActive,
        }"
      >
        <span class="g-ellipsis-text">
          {{ name }}
        </span>

        <v-icon
          v-if="isActive"
          small
        >
          mdi-volume-high
        </v-icon>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Route } from 'vue-router';

export type Item = {
  name: string
  to: string
  icon?: string
  uri?: string
}

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    to: {
      type: [String, Object] as PropType<string | Route>,
      required: true,
    },
    icon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" module>
.NavigationListItem {
  &--dense {
    min-height: 36px;
  }

  &__title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
