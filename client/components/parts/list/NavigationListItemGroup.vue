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
      :ref="VIRTUAL_SCROLLER_WRAPPER_REF"
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

export type { Item } from '~/components/parts/list/NavigationListItem.vue';

const VIRTUAL_SCROLLER_WRAPPER_REF = 'VIRTUAL_SCROLLER_WRAPPER_REF';

type Data = {
  VIRTUAL_SCROLLER_WRAPPER_REF: string
  virtualScrollerHeight: number
  resizeObserver: ResizeObserver | undefined
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
      VIRTUAL_SCROLLER_WRAPPER_REF,
      virtualScrollerHeight: 0,
      resizeObserver: undefined,
    };
  },

  mounted() {
    if (this.scroll) {
      const element = this.$refs[VIRTUAL_SCROLLER_WRAPPER_REF] as HTMLDivElement;
      this.calculateVirtualScrollerHeight(element.clientHeight);

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            this.calculateVirtualScrollerHeight(entry.contentRect.height);
          });
        });
        this.resizeObserver.observe(element);
      }
    }
  },

  beforeDestroy() {
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  },

  methods: {
    calculateVirtualScrollerHeight(height: number) {
      this.$nextTick().then(() => {
        this.virtualScrollerHeight = Math.max(Math.floor(height), 0);
      });
    },
  },
});
</script>

<style lang="scss" module>
.NavigationDrawerListItemGroup {
  $subheader-height: 2em;
  // アイテムを 最低 3 個は表示
  $scroll-content-min-height: $list-dense-min-height * 3;

  &__subheader {
    font-size: 0.75em;
    height: $subheader-height;
    vertical-align: text-top;
    // vertical-align を利かせるために inline にする
    display: inline-block;
  }

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
}
</style>
