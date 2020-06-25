<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :class="{
        [$style.TrackListTableRow]: true,
        'inactive--text': !item.isPlayable
      }"
      :data-is-active="isActive"
      @click="onRowClicked"
    >
      <td>
        <div
          :class="$style.TrackListTableRow__buttons"
          class="text-center"
        >
          <PlaylistMediaButton
            :is-hovered="isRowHovered"
            :is-playing-track="isPlayingTrack"
            :disabled="!item.isPlayable"
            @on-clicked="onMediaButtonClicked"
          />

          <FavoriteButton
            :is-favorited="item.isSaved"
            @on-clicked="onFavoriteButtonClicked"
          />
        </div>
      </td>

      <td>
        <div :class="$style.TrackListTableRow__content">
          <div class="g-ellipsis-text">
            <div
              :class="titleColor"
              class="g-ellipsis-text"
              :title="item.name"
            >
              {{ item.name }}
            </div>

            <div
              :class="[$style.TrackListTableRow__contentSubtitle, subtitleColor]"
              class="g-ellipsis-text"
            >
              <ArtistNames
                inline
                :artist-list="item.artistList"
              />

              <span>・</span>

              <nuxt-link
                :to="`/releases/${item.releaseId}`"
                :title="item.releaseName"
              >
                {{ item.releaseName }}
              </nuxt-link>
            </div>
          </div>

          <div>
            <ExplicitChip v-if="item.explicit" />
          </div>
        </div>
      </td>

      <td
        :title="item.addedAt.title"
        :class="$style.TrackListTableRow__smallText"
        class="text-center"
      >
        <time
          v-if="item.addedAt.text"
          :datetime="item.addedAt.text"
        >
          {{ item.addedAt.text }}
        </time>
      </td>

      <td
        :class="$style.TrackListTableRow__smallText"
        class="text-center"
      >
        <TrackTime :time-ms="item.durationMs" />
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

import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import { App } from '~~/types';

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
    PlaylistMediaButton,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackTime,
  },

  props: {
    item: {
      type: Object as PropType<App.PlaylistTrackDetail>,
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
    addedAt: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    titleColor(): string | undefined {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (!this.item.isPlayable) return 'inactive--text';
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
.TrackListTableRow {
  cursor: pointer;
  padding: 16px 0;

  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }

  &__buttons {
    display: flex;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__content {
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:not(:last-child) {
      margin-right: 8px;
    }

    &Subtitle {
      margin-top: 0.2rem;
      font-size: 0.8rem;
    }
  }

  &__smallText {
    font-size: 0.75rem !important;
    white-space: nowrap;
    padding: 0 4px !important;
  }
}
</style>
