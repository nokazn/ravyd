<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :id="item.hash"
      :class="{
        [$style.TrackTableRow]: true,
        'inactive--text': !item.isPlayable
      }"
      :data-is-active="isActive"
      :data-is-track-set="isTrackSet"
      @click="onRowClicked"
    >
      <td class="text-center">
        <TrackListMediaButton
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          :track-number="item.trackNumber"
          :disabled="!item.isPlayable"
          @on-clicked="onMediaButtonClicked"
        />
      </td>

      <td>
        <FavoriteButton
          :is-favorited="item.isSaved"
          :disableda="!item.isPlayable"
          @on-clicked="onFavoriteButtonClicked"
        />
      </td>

      <td :title="item.name">
        <div :class="$style.TrackTableRow__content">
          <span
            class="g-ellipsis-text"
            :class="$style.TrackTableRow__contentTitle"
          >
            <span :class="titleColor">
              {{ item.name }}
            </span>

            <template v-if="item.artistList.length > 0">
              <span :class="subtextColor">-</span>
              <ArtistNames
                :artist-list="item.artistList"
                inline
                :class="subtextColor"
              />
            </template>
          </span>

          <ExplicitChip
            v-if="item.explicit"
          />
        </div>
      </td>

      <td class="text-center">
        <TrackDuration
          :duration-ms="item.durationMs"
        />
      </td>

      <td>
        <v-btn
          icon
          size="small"
          :disabled="!item.isPlayable"
          title="メニュー"
        >
          <v-icon>
            mdi-dots-horizontal
          </v-icon>
        </v-btn>
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
import TrackDuration from '~/components/parts/text/TrackDuration.vue';
import { App } from '~~/types';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_ROW_CLICKED]: App.TrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export type Item = App.TrackDetail

export default Vue.extend({
  components: {
    TrackListMediaButton,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackDuration,
  },

  props: {
    item: {
      type: Object as PropType<Item>,
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
  },

  computed: {
    titleColor(): string | undefined {
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
    subtextColor(): string | undefined {
      return this.isTrackSet
        ? 'active--text'
        : 'subtext--text';
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

<style lang="scss" module>
.TrackTableRow {
  cursor: pointer;

  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }

  &__content {
    display: flex;
    justify-content: space-between;

    & > *:not(:last-child) {
      margin-right: 8px;
    }

    &Title {
      & > *:not(:last-child) {
        margin-right: 4px;
      }
    }
  }
}
</style>
