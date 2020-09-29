<template>
  <TrackTableRowMobile
    v-if="$window.isSingleColumn"
    :item="item"
    :is-track-set="isTrackSet"
    :is-playing-track="isPlayingTrack"
    :is-active="isActive"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <TrackTableRowPc
    v-else-if="$window.isMultiColumn"
    :item="item"
    :is-track-set="isTrackSet"
    :is-playing-track="isPlayingTrack"
    :is-active="isActive"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackTableRowMobile, { On as OnRowMobile } from '~/components/parts/table/TrackTableRow.mobile.vue';
import TrackTableRowPc, { On as OnRowPc } from '~/components/parts/table/TrackTableRow.pc.vue';
import { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnRowMobile & OnRowPc;

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
    isTrackSet: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
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
