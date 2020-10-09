<template>
  <v-menu
    :min-width="160"
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

type MenuItem = {
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
export type Group = MenuItem[];

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
    // fab の時のみ有効s
    color: {
      type: String,
      default: 'grey darken-3',
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
      type: Array as PropType<MenuItem[][]>,
      required: true,
    },
  },

  computed: {
    iconSize(): number {
      return Math.floor(this.size * 0.7);
    },
  },
});
</script>
