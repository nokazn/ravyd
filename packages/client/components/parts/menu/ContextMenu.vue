<template>
  <v-menu
    v-model="menu"
    :min-width="172"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :z-index="$constant.Z_INDEX_OF.menu"
  >
    <template #activator="{ on }">
      <v-btn
        :height="size"
        :width="size"
        :loading="loading"
        :color="fab ? color : undefined"
        :fab="fab"
        :icon="!fab"
        :outlined="outlined"
        :disabled="disabled"
        title="メニュー"
        v-on="on"
      >
        <v-icon :size="iconSize">
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
    </template>

    <v-list
      dense
      :color="$constant.MENU_BACKGROUND_COLOR"
      :elevation="12"
    >
      <template v-for="(group, index) in groups">
        <v-divider
          v-show="index !== 0"
          :key="`${index}-devider`"
        />

        <v-list-item-group :key="index">
          <template v-for="(item, i) in group">
            <v-list-item
              v-if="item.type === 'to'"
              :key="item.name"
              nuxt
              :to="item.to"
              :disabled="item.disabled"
              :inactive="item.disabled"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-else-if="item.type === 'custom'"
              :key="item.name"
              :disabled="item.disabled"
              :inactive="item.disabled"
              @click="item.handler"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>

            <component
              :is="item.component"
              v-else
              :key="i"
              v-bind="item.props"
            />
          </template>
        </v-list-item-group>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  PropType,
} from '@vue/composition-api';
import type { App } from '~/entities';

export default defineComponent({
  props: {
    size: {
      type: Number,
      default: 36,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // fab の時のみ有効
    color: {
      type: String,
      default: 'secondary',
    },
    fab: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: Boolean,
      default: false,
    },
    offsetY: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    groups: {
      type: Array as PropType<App.MenuItemGroup[]>,
      required: true,
    },
  },

  setup(props, { root }) {
    const iconSize = computed(() => Math.floor(props.size * 0.7));
    const menu = ref(false);

    watch(menu, (v) => {
      if (root.$screen.isSingleColumn) {
        root.$overlay.change(v, {
          fullscreen: true,
        });
      }
    });

    return {
      iconSize,
      menu,
    };
  },
});
</script>
