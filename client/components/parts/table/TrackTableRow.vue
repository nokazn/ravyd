<template>
  <TrackTableRowMobile
    v-if="$screen.isSingleColumn"
    :item="item"
    :active="active"
    :title-color="titleColor"
    :subtitle-color="subtextColor"
    @on-row-clicked="onRowClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
  <TrackTableRowPc
    v-else-if="$screen.isMultiColumn"
    :item="item"
    :active="active"
    :playing="playing"
    :title-color="titleColor"
    :subtitle-color="subtextColor"
    @on-row-clicked="onRowClicked"
    @on-media-button-clicked="onMediaButtonClicked"
    @on-favorite-button-clicked="onFavoriteButtonClicked"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import TrackTableRowMobile, { On as OnMobile } from '~/components/parts/table/TrackTableRow.mobile.vue';
import TrackTableRowPc, { On as OnPc } from '~/components/parts/table/TrackTableRow.pc.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

export const ON_ROW_CLICKED = 'on-row-clicked';
export const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
export const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = OnMobile | OnPc;

export default defineComponent({
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
  },

  setup(props, { emit }) {
    const titleColor = computed(() => textColorClass(props.set, !props.item.isPlayable));
    const subtextColor = computed(() => subtextColorClass(props.set, !props.item.isPlayable));
    const onRowClicked = (row: On['on-row-clicked']) => { emit(ON_ROW_CLICKED, row); };
    const onMediaButtonClicked = (row: On['on-media-button-clicked']) => { emit(ON_MEDIA_BUTTON_CLICKED, row); };
    const onFavoriteButtonClicked = (row: On['on-favorite-button-clicked']) => { emit(ON_FAVORITE_BUTTON_CLICKED, row); };

    return {
      titleColor,
      subtextColor,
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>
