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

    <td>
      <div :class="$style.Content">
        <div
          :title="item.name"
          :class="[$style.Content__title, titleColor]"
        >
          <nuxt-link
            :to="trackPath"
            class="g-ellipsis-text"
            @click.native.stop
          >
            {{ item.name }}
          </nuxt-link>
          <ExplicitChip v-if="item.explicit" />
        </div>

        <div
          :class="subtitleColor"
          class="g-small-text g-ellipsis-text"
        >
          <ArtistNames
            v-if="item.type === 'track'"
            ellipsis
            :artists="item.artists"
          />
          <nuxt-link
            v-else-if="item.type === 'episode'"
            :to="releasePath"
            :title="item.releaseName"
            class="g-ellipsis-text"
            @click.native.stop
          >
            {{ item.releaseName }}
          </nuxt-link>
        </div>
      </div>
    </td>

    <td class="text-center">
      <FavoriteButton
        v-if="item.type !== 'episode'"
        :size="buttonSize"
        :value="item.isSaved"
        @input="onFavoriteButtonClicked"
      />
    </td>

    <td>
      <EpisodeMenu
        v-if="item.type === 'episode'"
        left
        offset-x
        :size="buttonSize"
        :episode="item"
        :playlist-id="playlistId"
        :publisher="publisher"
      />
      <TrackMenu
        v-else
        left
        offset-x
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
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import {
  ON_ROW_CLICKED,
  ON_MEDIA_BUTTON_CLICKED,
  ON_FAVORITE_BUTTON_CLICKED,
} from '~/components/parts/table/PlaylistTrackTableRow.vue';
import type { App } from '~~/types';

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

  .Content {
    & > *:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    &__title {
      display: flex;
      align-items: center;

      & > *:not(:first-child) {
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
