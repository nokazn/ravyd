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
      v-if="image"
      :title="item.name"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="item.name"
        :size="SIZE_OF_ARTWORK"
      />
    </td>

    <td>
      <div
        :class="$style.PlaylistTrackTableRow__buttons"
        class="text-center"
      >
        <PlaylistMediaButton
          :is-playing-track="isPlayingTrack"
          :disabled="disabled"
          @on-clicked="onMediaButtonClicked"
        />

        <FavoriteButton
          v-if="item.type !== 'episode'"
          :is-favorited="item.isSaved"
          @on-clicked="onFavoriteButtonClicked"
        />
      </div>
    </td>

    <td>
      <div :class="$style.Content">
        <div class="g-ellipsis-text">
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
            class="g-ellipsis-text"
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
      :class="$style.PlaylistTrackTableRow__smallText"
      class="g-ellipsis-text"
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
      :class="$style.PlaylistTrackTableRow__smallText"
    >
      <time
        v-if="item.addedAt.text"
        :datetime="item.addedAt.text"
      >
        {{ item.addedAt.text }}
      </time>
    </td>

    <td
      :class="$style.PlaylistTrackTableRow__smallText"
      class="text-center"
    >
      <TrackTime :time-ms="item.durationMs" />
    </td>

    <td>
      <EpisodeMenu
        v-if="item.type === 'episode'"
        offset-x
        left
        :episode="item"
        :playlist-id="playlistId"
        :publisher="publisher"
      />
      <TrackMenu
        v-else
        offset-x
        left
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
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';

import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

export const SIZE_OF_ARTWORK = 48;
const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

type Data = {
  SIZE_OF_ARTWORK: number
}

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
    isActive: {
      type: Boolean,
      required: true,
    },
    image: {
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

  data(): Data {
    return {
      SIZE_OF_ARTWORK,
    };
  },

  computed: {
    /**
     * @todo
     * エピソードは isPlayable が false でも再生できるようにしている
     */
    disabled(): boolean {
      return this.item.type !== 'episode' && this.item.isPlayable === false;
    },
    artworkSrc(): string | undefined {
      return getImageSrc(this.item.images, SIZE_OF_ARTWORK);
    },
    trackPath(): RawLocation {
      return this.item.type === 'track'
        ? {
          path: `/releases/${this.item.releaseId}`,
          query: { track: this.item.id },
        }
        : `/episodes/${this.item.id}`;
    },
    releasePath(): RawLocation {
      return this.item.type === 'track'
        ? `/releases/${this.item.releaseId}`
        : `/shows/${this.item.releaseId}`;
    },
    userPath(): RawLocation | undefined {
      const addedBy = this.item;
      return this.collaborative && addedBy != null
        ? `/users/${addedBy.id}`
        : undefined;
    },
    publisher(): string {
      return this.item.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    titleColor(): string | undefined {
      if (this.disabled) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (this.disabled) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : 'subtext--text';
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
      margin-right: 1em;
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
