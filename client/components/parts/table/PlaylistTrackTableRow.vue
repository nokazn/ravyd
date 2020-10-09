<template>
  <PlaylistTrackTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :playlist-id="playlistId"
    :hide-image="hideImage"
    :collaborative="collaborative"
    :hide-added-at="hideAddedAt"
    :button-size="buttonSize"
    :disabled="disabled"
    :artwork-src="artworkSrc"
    :track-path="trackPath"
    :release-path="releasePath"
    :user-path="userPath"
    :publisher="publisher"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <PlaylistTrackTableRowPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :playlist-id="playlistId"
    :hide-image="hideImage"
    :collaborative="collaborative"
    :hide-added-at="hideAddedAt"
    :playing="playing"
    :button-size="buttonSize"
    :disabled="disabled"
    :artwork-src="artworkSrc"
    :track-path="trackPath"
    :release-path="releasePath"
    :user-path="userPath"
    :publisher="publisher"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import type { RawLocation } from 'vue-router';

import PlaylistTrackTableRowMobile, { On as OnMobile } from '~/components/parts/table/PlaylistTrackTableRow.mobile.vue';
import PlaylistTrackTableRowPc, { On as OnPc } from '~/components/parts/table/PlaylistTrackTableRow.pc.vue';
import { getImageSrc } from '~/utils/image';
import type { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default Vue.extend({
  components: {
    PlaylistTrackTableRowMobile,
    PlaylistTrackTableRowPc,
  },

  props: {
    item: {
      type: Object as PropType<App.PlaylistTrackDetail>,
      required: true,
    },
    playlistId: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    set: {
      type: Boolean,
      required: true,
    },
    playing: {
      type: Boolean,
      required: true,
    },
    hideImage: {
      type: Boolean,
      default: false,
    },
    collaborative: {
      type: Boolean,
      default: false,
    },
    hideAddedAt: {
      type: Boolean,
      default: false,
    },
    buttonSize: {
      type: Number,
      default: 36,
    },
  },

  computed: {
    /**
     * @todo
     * エピソードは isPlayable が false でも再生できるようにしている
     */
    disabled(): boolean {
      return this.item.type !== 'episode' && this.item.isPlayable === false;
    },
    artworkSrc(): string | undefined {
      return getImageSrc(this.item.images, this.$constant.PLAYLIST_TRACK_TABLE_ARTWORK_SIZE);
    },
    trackPath(): RawLocation {
      return this.item.type === 'track'
        ? {
          path: `/releases/${this.item.releaseId}`,
          query: { track: this.item.id },
        }
        : `/episodes/${this.item.id}`;
    },
    releasePath(): RawLocation {
      return this.item.type === 'track'
        ? `/releases/${this.item.releaseId}`
        : `/shows/${this.item.releaseId}`;
    },
    userPath(): RawLocation | undefined {
      const addedBy = this.item;
      return this.collaborative && addedBy != null
        ? `/users/${addedBy.id}`
        : undefined;
    },
    publisher(): string {
      return this.item.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    titleColor(): string | undefined {
      if (this.disabled) return 'inactive--text';
      return this.set
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (this.disabled) return 'inactive--text';
      return this.set
        ? 'active--text'
        : 'subtext--text';
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
