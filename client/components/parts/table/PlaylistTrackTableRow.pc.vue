<template>
  <tr
    :class="{
      [$style.PlaylistTrackTableRow]: true,
      'inactive--text': disabled
    }"
    @click="onRowClicked"
  >
    <td
      v-if="!hideImage"
      :title="item.name"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="item.name"
        :size="$constant.PLAYLIST_TRACK_TABLE_ARTWORK_SIZE"
      />
    </td>

    <td class="text-center">
      <PlaylistMediaButton
        :size="buttonSize"
        :is-playing-track="isPlayingTrack"
        :disabled="disabled"
        @on-clicked="onMediaButtonClicked"
      />
    </td>

    <td class="text-center">
      <FavoriteButton
        v-if="item.type !== 'episode'"
        :size="buttonSize"
        :is-favorited="item.isSaved"
        @on-clicked="onFavoriteButtonClicked"
      />
    </td>

    <td>
      <div :class="$style.Content">
        <div
          class="g-ellipsis-text"
          :class="$style.Content__left"
        >
          <div
            :class="titleColor"
            class="g-ellipsis-text"
            :title="item.name"
          >
            <nuxt-link :to="trackPath">
              {{ item.name }}
            </nuxt-link>
          </div>

          <div
            :class="[$style.Content__subtitle, subtitleColor]"
            class="g-small-text g-ellipsis-text"
          >
            <template v-if="item.type === 'track'">
              <ArtistNames
                inline
                :artists="item.artists"
              />
              <span :class="$style['Content__subtitle--divider']">-</span>
            </template>

            <nuxt-link
              :to="releasePath"
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
      v-if="collaborative"
      class="g-small-text g-ellipsis-text"
    >
      <nuxt-link
        v-if="userPath != null"
        :to="userPath"
      >
        {{ item.addedBy.display_name || item.addedBy.id }}
      </nuxt-link>
    </td>

    <td
      v-if="!hideAddedAt && item.addedAt != null"
      :title="item.addedAt.title"
    >
      <time
        v-if="item.addedAt.text"
        :datetime="item.addedAt.text"
        class="g-small-text"
      >
        {{ item.addedAt.text }}
      </time>
    </td>

    <td class="g-small-text text-center">
      <TrackTime
        :time-ms="item.durationMs"
      />
    </td>

    <td>
      <EpisodeMenu
        v-if="item.type === 'episode'"
        offset-x
        left
        :size="buttonSize"
        :episode="item"
        :playlist-id="playlistId"
        :publisher="publisher"
      />
      <TrackMenu
        v-else
        offset-x
        left
        :size="buttonSize"
        :track="item"
        :playlist-id="playlistId"
        @on-favorite-menu-clicked="onFavoriteButtonClicked"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import type { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
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
    ReleaseArtwork,
    PlaylistMediaButton,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackTime,
    TrackMenu,
    EpisodeMenu,
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
    disabled: {
      type: Boolean,
      required: true,
    },
    artworkSrc: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    trackPath: {
      type: [Object, String] as PropType<RawLocation>,
      required: true,
    },
    releasePath: {
      type: [Object, String] as PropType<RawLocation>,
      required: true,
    },
    userPath: {
      type: [Object, String] as PropType<RawLocation | undefined>,
      default: undefined,
    },
    publisher: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String,
      required: true,
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
.PlaylistTrackTableRow {
  .Content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:not(:first-child) {
      margin-left: 0.25rem;
    }

    &__left {
      & > *:not(:last-child) {
        margin-bottom: 0.25rem;
      }
    }

    &__subtitle {
      &--divider {
        margin: 0 0.25rem;
      }
    }
  }
}
</style>
