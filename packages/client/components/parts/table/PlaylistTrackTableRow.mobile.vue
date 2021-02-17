<template>
  <tr
    :class="{
      [$style.PlaylistTrackTableRow]: true,
      'inactive--text': disabled
    }"
    @click="onRowClicked"
  >
    <td :title="item.name">
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
          <span class="g-ellipsis-text">
            {{ item.name }}
          </span>
          <ExplicitChip v-if="item.explicit" />
        </div>

        <div
          :class="subtitleColor"
          class="g-small-text g-ellipsis-text"
        >
          <ArtistNames
            v-if="item.type === 'track'"
            text
            ellipsis
            :artists="item.artists"
          />
          <span
            v-else-if="item.type === 'episode'"
            :title="item.releaseName"
            class="g-ellipsis-text"
          >
            {{ item.releaseName }}
          </span>
        </div>
      </div>
    </td>

    <td :class="$style.PlaylistTrackTableRow__action">
      <FavoriteButton
        :disabled="item.type === 'episode'"
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :value="item.isSaved"
        @input="onFavoriteButtonClicked"
      />
      <EpisodeMenu
        v-if="item.type === 'episode'"
        left
        offset-x
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :episode="item"
        :playlist-id="playlistId"
        :publisher="publisher"
      />
      <TrackMenu
        v-else
        left
        offset-x
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :track="item"
        :playlist-id="playlistId"
        @on-favorite-menu-clicked="onFavoriteButtonClicked"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
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
import type { App } from '~/entities';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.PlaylistTrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail
}

export default defineComponent({
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
    collaborative: {
      type: Boolean,
      default: false,
    },
    hideAddedAt: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    artworkSrc: {
      type: String as PropType<string | undefined>,
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

  setup(props, { emit }) {
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      onRowClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.PlaylistTrackTableRow {
  cursor: pointer;

  &__action {
    & > *:not(:last-child) {
      margin-right: 2px;
    }
  }

  .Content {
    & > *:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    &__title {
      display: flex;
      align-items: center;
      font-size: 0.9rem;

      & > *:first-child {
        @include avoid-overflowing();
      }

      & > *:not(:first-child) {
        margin-left: 0.25rem;
        flex: 0 0 $g-explicit-chip-width;
      }
    }
  }
}
</style>
