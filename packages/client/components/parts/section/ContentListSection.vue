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
import { defineComponent, PropType } from '@vue/composition-api';
import ContentListItem from '~/components/parts/list/ContentListItem.vue';
import type { App } from '~/entities';

export default defineComponent({
  components: {
    ContentListItem,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<App.ContentItem[]>,
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
