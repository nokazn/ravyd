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

    <td class="text-center">
      <PlaylistMediaButton
        :size="$constant.DEFAULT_BUTTON_SIZE"
        :disabled="disabled"
        :value="playing"
        @input="onMediaButtonClicked"
      />
    </td>

    <td class="text-center">
      <FavoriteButton
        :disabled="item.type === 'episode'"
        :size="$constant.DEFAULT_BUTTON_SIZE"
        :value="item.isSaved"
        @input="onFavoriteButtonClicked"
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
                ellipsis
                :artists="item.artists"
              />
              <span>-</span>
            </template>
            <nuxt-link
              :to="releasePath"
              :title="item.releaseName"
            >
              {{ item.releaseName }}
            </nuxt-link>
          </div>
        </div>

        <ExplicitChip
          v-if="item.explicit"
          :class="$style.Content__right"
        />
      </div>
    </td>

    <td
      v-if="collaborative"
      class="g-small-text g-ellipsis-text text-center"
    >
      <nuxt-link
        v-if="userPath != null && item.addedBy != null"
        :to="userPath"
      >
        {{ item.addedBy.display_name || item.addedBy.id }}
      </nuxt-link>
    </td>

    <td
      v-if="!hideAddedAt && item.addedAt != null"
      :title="item.addedAt.title"
      class="text-center"
    >
      <time
        v-if="item.addedAt.text"
        :datetime="item.addedAt.origin"
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
        :size="$constant.DEFAULT_BUTTON_SIZE"
        :episode="item"
        :playlist-id="playlistId"
        :publisher="publisher"
      />
      <TrackMenu
        v-else
        offset-x
        left
        :size="$constant.DEFAULT_BUTTON_SIZE"
        :track="item"
        :playlist-id="playlistId"
        @on-favorite-menu-clicked="onFavoriteButtonClicked"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import type { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import {
  ON_ROW_CLICKED,
  ON_MEDIA_BUTTON_CLICKED,
  ON_FAVORITE_BUTTON_CLICKED,
} from '~/components/parts/table/PlaylistTrackTableRow.vue';
import type { App } from '~/entities';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail;
  [ON_MEDIA_BUTTON_CLICKED]: App.PlaylistTrackDetail;
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail;
}

export default defineComponent({
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
    playing: {
      type: Boolean,
      required: true,
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
      type: String as PropType<App.TitleColorClass | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String as PropType<App.SubtitleColorClass>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    const onMediaButtonClicked = () => { emit(ON_MEDIA_BUTTON_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.PlaylistTrackTableRow {
  .Content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__left {
      & > *:not(:last-child) {
        margin-bottom: 0.25rem;
      }
    }

    &__right {
      margin-left: 0.5rem;
      flex: 0 0 $g-explicit-chip-width;
    }

    &__subtitle {
      & > *:not(:last-child) {
        margin-right: 0.25rem;
      }
    }
  }
}
</style>
