<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :class="{
        [$style.TrackTableRow]: true,
        'inactive--text': !item.isPlayable
      }"
      :data-is-active="isActive"
      @click="onRowClicked"
    >
      <td class="text-center">
        <TrackListMediaButton
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          :track-number="trackNumber"
          :disabled="!item.isPlayable"
          @on-clicked="onMediaButtonClicked"
        />
      </td>

      <td>
        <FavoriteButton
          :size="buttonSize"
          :is-favorited="item.isSaved"
          :disableda="!item.isPlayable"
          @on-clicked="onFavoriteButtonClicked"
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
              <span :class="subtextColor">-</span>
              <ArtistNames
                :artists="item.featuredArtists"
                inline
                :class="subtextColor"
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
          :size="buttonSize"
          :track="item"
          @on-favorite-menu-clicked="onFavoriteButtonClicked"
        />
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

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
import type { App } from '~~/types';

export type On = {
  [ON_ROW_CLICKED]: App.TrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export default Vue.extend({
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
    buttonSize: {
      type: Number,
      default: 36,
    },
    titleColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    subtextColor: {
      type: String,
      required: true,
    },
  },

  computed: {
    // relink されたトラックを含む場合はインデックスを表示
    trackNumber(): number {
      const { item } = this;
      return item.linkedFrom != null
        ? item.index + 1
        : item.trackNumber;
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
    margin-left: 0.25rem;
  }

  &__title {
    & > *:not(:first-child) {
      margin-left: 0.25rem;
    }
  }
}
</style>
