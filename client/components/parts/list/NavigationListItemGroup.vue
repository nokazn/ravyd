<template>
  <v-list-item-group
    :class="{
      [$style['NavigationDrawerListItemGroup--scroll']]: scroll,
    }"
  >
    <v-subheader
      v-if="subtitle != null"
      :class="$style.NavigationDrawerListItemGroup__subheader"
    >
      {{ subtitle }}
    </v-subheader>

    <div
      v-if="scroll"
      :ref="REF_KEY"
      :class="$style['NavigationDrawerListItemGroup__wrapper--scroll']"
    >
      <v-virtual-scroll
        v-if="virtualScrollerHeight > 0"
        :items="items"
        :item-height="36"
        min-height="1"
        :height="virtualScrollerHeight"
        class="g-custom-scroll-bar"
      >
        <template #default="{ item }">
          <NavigationListItem
            v-bind="item"
            dense
          />
        </template>
      </v-virtual-scroll>
    </div>

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

const REF_KEY = 'virtualScrollerWrapper';
const ON_LOADED = 'on-loaded';

type Data = {
  REF_KEY: string
  virtualScrollerHeight: number
}

type On = {
  [ON_LOADED]: void
}

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

  data(): Data {
    return {
      REF_KEY,
      virtualScrollerHeight: 0,
    };
  },

  mounted() {
    if (this.scroll) {
      this.calculateVirtualScrollerHeight();
      this.$emit(ON_LOADED);
    }
  },

  methods: {
    calculateVirtualScrollerHeight() {
      this.$nextTick(() => {
        const element = this.$refs[REF_KEY] as Element;
        this.virtualScrollerHeight = Math.max(Math.floor(element.clientHeight - 1), 0);
      });
    },
  },
});
</script>

<style lang="scss" module>
.NavigationDrawerListItemGroup {
  $subheader-height: 28px;
  // アイテムを 最低 4 個は表示
  $scroll-content-min-height: calc(#{$list-dense-min-height} * 4);

  &--scroll {
    overflow-y: auto;
    flex: 1 0;
    height: 100%;
    min-height: calc(#{$scroll-content-min-height} + #{$subheader-height});
  }

  &__wrapper--scroll {
    height: calc(100% - #{$subheader-height});
    min-height: $scroll-content-min-height;
  }

  &__subheader {
    font-size: 12px;
    height: $subheader-height;
  }
}
</style>
