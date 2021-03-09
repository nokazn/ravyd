<template>
  <v-hover v-slot="{ hover: isRowHovered }">
    <tr
      :class="{
        [$style.TrackTableRow]: true,
        'inactive--text': !item.isPlayable
      }"
      :data-is-active="active"
      @click="onRowClicked"
    >
      <td class="text-center">
        <TrackListMediaButton
          :value="playing"
          :hover="isRowHovered"
          :track-number="trackNumber"
          :disabled="!item.isPlayable"
          @input="onMediaButtonClicked"
        />
      </td>

      <td>
        <FavoriteButton
          :size="$constant.DEFAULT_BUTTON_SIZE"
          :value="item.isSaved"
          @input="onFavoriteButtonClicked"
        />
      </td>

      <td :title="item.name">
        <div :class="$style.Content">
          <span
            class="g-ellipsis-text"
            :class="$style.Content__title"
          >
            <span :class="titleColor">
              {{ item.name }}
            </span>

            <template v-if="item.featuredArtists.length > 0">
              <span :class="subtitleColor">-</span>
              <ArtistNames
                inline
                :artists="item.featuredArtists"
                :class="subtitleColor"
              />
            </template>
          </span>

          <ExplicitChip v-if="item.explicit" />
        </div>
      </td>

      <td class="text-center">
        <TrackTime :time-ms="item.durationMs" />
      </td>

      <td>
        <TrackMenu
          offset-x
          left
          :size="$constant.DEFAULT_BUTTON_SIZE"
          :track="item"
          @on-favorite-menu-clicked="onFavoriteButtonClicked"
        />
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import {
  ON_ROW_CLICKED,
  ON_MEDIA_BUTTON_CLICKED,
  ON_FAVORITE_BUTTON_CLICKED,
} from '~/components/parts/table/TrackTableRow.vue';
import type { App } from '~/entities';

export type On = {
  [ON_ROW_CLICKED]: App.TrackDetail;
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail;
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail;
}

export default defineComponent({
  components: {
    TrackListMediaButton,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackTime,
    TrackMenu,
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
    playing: {
      type: Boolean,
      required: true,
    },
    titleColor: {
      type: String as PropType<App.TitleColorClass | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String as PropType<App.SubtitleColorClass>,
      required: true,
    },
  },

  setup(props, { emit }) {
    // relink されたトラックを含む場合はインデックスを表示
    const trackNumber = computed(() => {
      return props.item.linkedFrom != null
        ? props.item.index + 1
        : props.item.trackNumber;
    });
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    const onMediaButtonClicked = () => { emit(ON_MEDIA_BUTTON_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      trackNumber,
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.TrackTableRow {
  &[data-is-active=true] {
    background-color: lighten($g-background-color, 16%);
  }
}

.Content {
  padding-left: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.5rem;
    flex: 0 0 $g-explicit-chip-width;
  }

  &__title {
    & > *:not(:first-child) {
      margin-left: 0.25rem;
      font-size: 0.85rem;
    }
  }
}
</style>
