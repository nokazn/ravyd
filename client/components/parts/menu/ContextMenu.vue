<template>
  <v-menu
    :min-width="160"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :z-index="Z_INDEX"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :height="size"
        :width="size"
        :loading="loading"
        :outlined="outlined"
        :disabled="disabled"
        title="メニュー"
        v-on="on"
      >
        <v-icon>
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
    </template>

    <v-list
      dense
      :color="MENU_BACKGROUND_COLOR"
      :elevation="12"
    >
      <template v-for="(group, index) in itemLists">
        <v-divider
          v-show="index !== 0"
          :key="`${index}-devider`"
        />

        <v-list-item-group :key="index">
          <template v-for="item in group">
            <component
              :is="item.component"
              v-if="item.component != null"
              :key="item.name"
              v-bind="item.props"
            />

            <v-list-item
              v-else-if="item.to != null"
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
              v-else
              :key="item.name"
              :disabled="item.disabled"
              :inactive="item.disabled"
              @click="item.handler"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';

import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/constants';

export type MenuItem = {
  name: string
  disabled?: boolean
  to: string
} | {
  name: string
  disabled?: boolean
  handler: () => void
} | {
  component: VueConstructor
  props: { [k in string]: unknown }
}

type Data = {
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 36,
    },
    loading: {
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
    itemLists: {
      type: Array as PropType<MenuItem[][]>,
      required: true,
    },
  },

  data(): Data {
    return {
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },
});
</script>
