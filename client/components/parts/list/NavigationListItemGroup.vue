<template>
  <v-list-item-group
    :class="{
      [$style['NavigationDrawerListItemGroup--scroll']]: scroll,
    }"
  >
    <v-subheader
      v-if="subtitle != null"
      :class="$style.NavigationDrawer__subheader"
    >
      {{ subtitle }}
    </v-subheader>

    <v-virtual-scroll
      v-if="scroll"
      ref="virtualScroller"
      :items="items"
      :item-height="36"
      min-height="100"
      height="100"
      class="g-custom-scroll-bar"
    >
      <template #default="{ item }">
        <NavigationListItem
          v-bind="item"
          dense
        />
      </template>
    </v-virtual-scroll>

    <div v-else>
      <NavigationListItem
        v-for="item in items"
        :key="item.to"
        v-bind="item"
      />
    </div>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import NavigationListItem, { Item } from '~/components/parts/list/NavigationListItem.vue';

export { Item } from '~/components/parts/list/NavigationListItem.vue';

export default Vue.extend({
  components: {
    NavigationListItem,
  },

  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    subtitle: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    scroll: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    if (this.scroll) {
      console.log({ ref: this.$refs.virtualScroller });
    }
  },
});
</script>

<style lang="scss" module>
.NavigationDrawerListItemGroup {
  &--scroll {
    overflow-y: auto;
    flex: 1 0;
    height: 100%;
  }

  &__subheader {
    font-size: 12px;
    height: 28px;
  }
}
</style>
