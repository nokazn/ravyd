<template>
  <section :class="$style.ContentListSection">
    <div :class="$style.ContentListSection__header">
      <h2>
        {{ title }}
      </h2>
    </div>

    <v-divider :class="$style.ContentListSection__divider" />

    <client-only>
      <v-list
        dense
        nav
        color="transparent"
        :class="$style.ContentListItem__list"
      >
        <ContentListItem
          v-for="(item, index) in items"
          v-show="length == null || index < length"
          :key="item.id"
          :item="item"
        />
      </v-list>
    </client-only>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContentListItem from '~/components/parts/list/ContentListItem.vue';
import { App } from '~~/types';

const ON_BUTTON_CLICKED = 'on-button-clicked';
const ON_BUTTON_HOVERED = 'on-button-hovered';
const ON_LOADING_APPEARED = 'on-loading-appeared';

export type On = {
  [ON_BUTTON_CLICKED]: boolean;
  [ON_BUTTON_HOVERED]: void;
  [ON_LOADING_APPEARED]: void;
}

export default Vue.extend({
  components: {
    ContentListItem,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<App.ContentItemInfo[]>,
      required: true,
    },
    length: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },
});
</script>

<style lang="scss" module>
.ContentListSection {
  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__divider {
    margin-top: 8px;
  }
}
</style>
