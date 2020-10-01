<template>
  <tr
    :class="{
      [$style.PlaylistTrackTableRow]: true,
      'inactive--text': disabled
    }"
    :data-is-active="isActive"
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

    <td>
      <div :class="$style.Content">
        <div class="g-ellipsis-text">
          <div
            :class="titleColor"
            class="g-ellipsis-text"
            :title="item.name"
          >
            <nuxt-link
              :to="trackPath"
              @click.native.stop
            >
              {{ item.name }}
            </nuxt-link>
          </div>

          <div
            :class="[$style.Content__subtitle, subtitleColor]"
            class="g-ellipsis-text"
          >
            <ArtistNames
              v-if="item.type === 'track'"
              inline
              :artists="item.artists"
            />
            <nuxt-link
              v-else-if="item.type === 'episode'"
              :to="releasePath"
              :title="item.releaseName"
              @click.native.stop
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

    <td class="text-center">
      <FavoriteButton
        v-if="item.type !== 'episode'"
        :size="buttonSize"
        :is-favorited="item.isSaved"
        @on-clicked="onFavoriteButtonClicked"
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
import { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
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
    ReleaseArtwork,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
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
  cursor: pointer;

  &[data-is-active=true] {
    background-color: lighten($g-background-color, 16%);
  }

  &__buttons {
    display: flex;

    & > *:not(:last-child) {
      margin-right: 4px;
    }
  }

  &__smallText {
    font-size: 0.75em !important;
    white-space: nowrap;
    padding: 0 0.25em !important;
  }

  .Content {
    padding: 0.75em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:not(:last-child) {
      margin-right: 0.25em;
    }

    &__subtitle {
      margin-top: 0.3em;
      font-size: 0.9em;

      &--divider {
        margin: 0 0.3em;
      }
    }
  }
}
</style>
