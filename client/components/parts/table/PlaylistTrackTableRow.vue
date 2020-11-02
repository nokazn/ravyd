<template>
  <PlaylistTrackTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :playlist-id="playlistId"
    :hide-image="hideImage"
    :collaborative="collaborative"
    :hide-added-at="hideAddedAt"
    :disabled="disabled"
    :artwork-src="artworkSrc"
    :publisher="publisher"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    @on-row-clicked="onRowClicked"
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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { RawLocation } from 'vue-router';

import PlaylistTrackTableRowMobile, { On as OnMobile } from '~/components/parts/table/PlaylistTrackTableRow.mobile.vue';
import PlaylistTrackTableRowPc, { On as OnPc } from '~/components/parts/table/PlaylistTrackTableRow.pc.vue';
import { getImageSrc } from '~/services/converter';
import { textColorClass, subtextColorClass } from '~/utils/text';
import type { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default defineComponent({
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
  },

  setup(props, { emit, root }) {
    // @todo エピソードは isPlayable が false でも再生できるようにしている
    const disabled = computed(() => props.item.type !== 'episode' && props.item.isPlayable === false);
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      root.$constant.PLAYLIST_TRACK_TABLE_ARTWORK_SIZE,
    ));
    const trackPath = computed<RawLocation>(() => {
      return props.item.type === 'track'
        ? {
          path: `/releases/${props.item.releaseId}`,
          query: { track: props.item.id },
        }
        : `/episodes/${props.item.id}`;
    });
    const releasePath = computed<RawLocation>(() => {
      return props.item.type === 'track'
        ? `/releases/${props.item.releaseId}`
        : `/shows/${props.item.releaseId}`;
    });
    const userPath = computed<RawLocation | undefined>(() => {
      const addedBy = props.item;
      return props.collaborative && addedBy != null
        ? `/users/${addedBy.id}`
        : undefined;
    });
    const publisher = computed(() => props.item.artists
      .map((artist) => artist.name)
      .join(', '));
    const titleColor = computed(() => textColorClass(props.set, disabled.value));
    const subtitleColor = computed(() => subtextColorClass(props.set, disabled.value));

    const onRowClicked = (row: On['on-row-clicked']) => { emit(ON_ROW_CLICKED, row); };
    const onMediaButtonClicked = (row: On['on-media-button-clicked']) => { emit(ON_MEDIA_BUTTON_CLICKED, row); };
    const onFavoriteButtonClicked = (row: On['on-favorite-button-clicked']) => { emit(ON_FAVORITE_BUTTON_CLICKED, row); };

    return {
      disabled,
      artworkSrc,
      trackPath,
      releasePath,
      userPath,
      publisher,
      titleColor,
      subtitleColor,
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>
