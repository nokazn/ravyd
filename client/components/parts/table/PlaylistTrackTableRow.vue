<template>
  <PlaylistTrackTableRowMobile
    v-if="$window.isSingleColumn"
    :item="item"
    :playlist-id="playlistId"
    :hide-image="hideImage"
    :collaborative="collaborative"
    :hide-added-at="hideAddedAt"
    :is-active="isActive"
    :is-track-set="isTrackSet"
    :is-playing-track="isPlayingTrack"
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
    v-else-if="$window.isMultiColumn"
    :item="item"
    :playlist-id="playlistId"
    :hide-image="hideImage"
    :collaborative="collaborative"
    :hide-added-at="hideAddedAt"
    :is-active="isActive"
    :is-track-set="isTrackSet"
    :is-playing-track="isPlayingTrack"
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

import PlaylistTrackTableRowMobile from '~/components/parts/table/PlaylistTrackTableRow.mobile.vue';
import PlaylistTrackTableRowPc from '~/components/parts/table/PlaylistTrackTableRow.pc.vue';
import { getImageSrc } from '~/utils/image';
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
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (this.disabled) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : 'subtext--text';
    },
  },

  methods: {
    onRowClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_ROW_CLICKED, { ...this.item });
    },
    onMediaButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_MEDIA_BUTTON_CLICKED, { ...this.item });
    },
    onFavoriteButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, { ...this.item });
    },
  },
});
</script>
