<template>
  <EpisodeTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :publisher="publisher"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    @on-row-clicked="onRowClicked"
  />
  <EpisodeTableRowPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :publisher="publisher"
    :playing="playing"
    :episode-path="episodePath"
    :title-color="titleColor"
    :subtitle-color="subtitleColor"
    :release-date="releaseDate"
    :hide-added-at="hideAddedAt"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import EpisodeTableRowMobile, { On as OnMobile } from '~/components/parts/table/EpisodeTableRow.mobile.vue';
import EpisodeTableRowPc, { On as OnPc } from '~/components/parts/table/EpisodeTableRow.pc.vue';
import { convertReleaseDate } from '~/services/converter';
import { textColorClass, subtextColorClass } from '~/utils/text';
import type { App } from '~/entities';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';
export type On = OnMobile & OnPc;

export default defineComponent({
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
    hideAddedAt: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const episodePath = computed(() => `/episodes/${props.item.id}`);
    const titleColor = computed(() => textColorClass(props.set, !props.item.isPlayable));
    const subtitleColor = computed(() => subtextColorClass(props.set, !props.item.isPlayable));
    const releaseDate = computed(() => convertReleaseDate({
      releaseDate: props.item.releaseDate,
      releaseDatePrecision: props.item.releaseDatePrecision,
      format: 'YYYY/M/D',
    }));

    const onRowClicked = (row: On['on-row-clicked']) => { emit(ON_ROW_CLICKED, row); };
    const onMediaButtonClicked = (row: On['on-media-button-clicked']) => { emit(ON_MEDIA_BUTTON_CLICKED, row); };
    const onFavoriteButtonClicked = (row: On['on-favorite-button-clicked']) => { emit(ON_FAVORITE_BUTTON_CLICKED, row); };

    return {
      episodePath,
      titleColor,
      subtitleColor,
      releaseDate,
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>
