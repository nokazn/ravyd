<template>
  <TrackListItemMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :artwork-src="artworkSrc"
    :title-color="titleColor"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <TrackListItemPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :playing="playing"
    :artwork-src="artworkSrc"
    :release-path="releasePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { RawLocation } from 'vue-router';

import TrackListItemMobile, { On as OnMobile } from '~/components/parts/list/TrackListItem.mobile.vue';
import TrackListItemPc, { On as OnPc } from '~/components/parts/list/TrackListItem.pc.vue';
import { getImageSrc } from '~/services/converter';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default defineComponent({
  components: {
    TrackListItemMobile,
    TrackListItemPc,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    playing: {
      type: Boolean,
      required: true,
    },
    set: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { root, emit }) {
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      root.$constant.TRACK_LIST_ARTWORK_SIZE,
    ));
    const releasePath = computed<RawLocation>(() => ({
      path: `/releases/${props.item.releaseId}`,
      query: { track: props.item.id },
    }));
    const titleColor = computed(() => textColorClass(props.set, !props.item.isPlayable));
    const subtitleColor = computed(() => (subtextColorClass(props.set, !props.item.isPlayable)));

    const onMediaButtonClicked = (row: On['on-media-button-clicked']) => { emit(ON_MEDIA_BUTTON_CLICKED, row); };
    const onFavoriteButtonClicked = (row: On['on-favorite-button-clicked']) => { emit(ON_FAVORITE_BUTTON_CLICKED, row); };

    return {
      artworkSrc,
      releasePath,
      titleColor,
      subtitleColor,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>
