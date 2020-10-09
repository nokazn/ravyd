<template>
  <EpisodeTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :publisher="publisher"
    :added-at="addedAt"
    :episode-path="episodePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    :release-date="releaseDate"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <EpisodeTableRowPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :publisher="publisher"
    :playing="playing"
    :added-at="addedAt"
    :episode-path="episodePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    :release-date="releaseDate"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import EpisodeTableRowMobile, { On as OnMobile } from '~/components/parts/table/EpisodeTableRow.mobile.vue';
import EpisodeTableRowPc, { On as OnPc } from '~/components/parts/table/EpisodeTableRow.pc.vue';
import { convertReleaseDate } from '~/utils/converter';
import type { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default Vue.extend({
  components: {
    EpisodeTableRowMobile,
    EpisodeTableRowPc,
  },

  props: {
    item: {
      type: Object as PropType<App.EpisodeDetail>,
      required: true,
    },
    publisher: {
      type: String,
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
    addedAt: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    episodePath(): string {
      return `/episodes/${this.item.id}`;
    },
    titleColor(): string | undefined {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.set
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.set
        ? 'active--text'
        : 'subtext--text';
    },
    releaseDate(): string {
      return convertReleaseDate({
        releaseDate: this.item.releaseDate,
        releaseDatePrecision: this.item.releaseDatePrecision,
        format: 'YYYY/M/D',
      });
    },
  },

  methods: {
    onRowClicked(row: On['on-row-clicked']) {
      this.$emit(ON_ROW_CLICKED, row);
    },
    onMediaButtonClicked(row: On['on-media-button-clicked']) {
      this.$emit(ON_MEDIA_BUTTON_CLICKED, row);
    },
    onFavoriteButtonClicked(row: On['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
  },
});
</script>
