<template>
  <TrackTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :active="active"
    :button-size="buttonSize"
    :title-color="titleColor"
    :subtext-color="subtextColor"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <TrackTableRowPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :active="active"
    :playing="playing"
    :button-size="buttonSize"
    :title-color="titleColor"
    :subtext-color="subtextColor"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackTableRowMobile, { On as OnMobile } from '~/components/parts/table/TrackTableRow.mobile.vue';
import TrackTableRowPc, { On as OnPc } from '~/components/parts/table/TrackTableRow.pc.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default Vue.extend({
  components: {
    TrackTableRowMobile,
    TrackTableRowPc,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    set: {
      type: Boolean,
      required: true,
    },
    playing: {
      type: Boolean,
      required: true,
    },
    buttonSize: {
      type: Number,
      default: 36,
    },
  },

  computed: {
    titleColor(): string | undefined {
      return textColorClass(this.set);
    },
    subtextColor(): string {
      return subtextColorClass(this.set);
    },
  },

  methods: {
    onRowClicked(row: On['on-row-clicked']) {
      // row をコピーしたものを参照する
      this.$emit(ON_ROW_CLICKED, row);
    },
    onMediaButtonClicked(row: On['on-media-button-clicked']) {
      // row をコピーしたものを参照する
      this.$emit(ON_MEDIA_BUTTON_CLICKED, row);
    },
    onFavoriteButtonClicked(row: On['on-favorite-button-clicked']) {
      // row をコピーしたものを参照する
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
  },
});
</script>
