<template>
  <EpisodeTableRowMobile
    v-if="$window.isSingleColumn"
    :item="item"
    :publisher="publisher"
    :is-episode-set="isEpisodeSet"
    :is-playing-episode="isPlayingEpisode"
    :is-active="isActive"
    :added-at="addedAt"
    :episode-path="episodePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    :release-date="releaseDate"
  />
  <EpisodeTableRowPc
    v-else-if="$window.isMultiColumn"
    :item="item"
    :publisher="publisher"
    :is-episode-set="isEpisodeSet"
    :is-playing-episode="isPlayingEpisode"
    :is-active="isActive"
    :added-at="addedAt"
    :episode-path="episodePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    :release-date="releaseDate"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import EpisodeTableRowMobile from '~/components/parts/table/EpisodeTableRow.mobile.vue';
import EpisodeTableRowPc from '~/components/parts/table/EpisodeTableRow.pc.vue';
import { convertReleaseDate } from '~/utils/converter';
import type { App } from '~~/types';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.PlaylistTrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail
}

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
    isEpisodeSet: {
      type: Boolean,
      required: true,
    },
    isPlayingEpisode: {
      type: Boolean,
      required: true,
    },
    isActive: {
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
      return this.isEpisodeSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.isEpisodeSet
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
    onRowClicked() {
      this.$emit(ON_ROW_CLICKED, this.item);
    },
    onMediaButtonClicked() {
      this.$emit(ON_MEDIA_BUTTON_CLICKED, this.item);
    },
    onFavoriteButtonClicked() {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, this.item);
    },
  },
});
</script>
