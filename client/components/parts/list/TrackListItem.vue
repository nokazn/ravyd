<template>
  <v-hover #default="{ hover }">
    <v-list-item
      dense
      :disabled="!item.isPlayable"
      :class="$style.TrackListItem"
      class="TrackListItem"
    >
      <v-list-item-avatar tile>
        <ReleaseArtwork
          :src="artworkSrc"
          :size="TRACK_LIST_ARTWORK_SIZE"
          :alt="item.name"
          :title="item.name"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <div :class="$style.Content">
          <div :class="$style.Content__left">
            <TrackListMediaButton
              :is-hovered="hover"
              :is-playing-track="isPlayingTrack"
              :track-number="item.index + 1"
              @on-clicked="onMediaButtonClicked"
            />

            <FavoriteButton
              :is-favorited="item.isSaved"
              @on-clicked="onFavoriteButtonClicked"
            />

            <div
              :class="$style.Content__title"
              class="g-ellipsis-text"
            >
              <nuxt-link
                :to="releasePath"
                :title="item.name"
                :class="textColor"
              >
                {{ item.name }}
              </nuxt-link>

              <template v-if="item.featuredArtists.length > 0">
                <span :class="subtextColor">-</span>
                <ArtistNames
                  :artists="item.featuredArtists"
                  inline
                  :class="subtextColor"
                />
              </template>
            </div>
          </div>
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <div :class="$style.TrackListItem__action">
          <ExplicitChip v-if="item.explicit" />

          <TrackTime :time-ms="item.durationMs" />

          <TrackMenu
            offset-x
            left
            :track="item"
            @on-favorite-menu-clicked="onFavoriteButtonClicked"
          />
        </div>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { TRACK_LIST_ARTWORK_SIZE } from '~/constants';
import { App } from '~~/types';

export type Data = {
  TRACK_LIST_ARTWORK_SIZE: number
}

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_MEDIA_BUTTON_CLICKED]:App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
    TrackListMediaButton,
    FavoriteButton,
    ExplicitChip,
    TrackTime,
    TrackMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    isTrackSet: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      TRACK_LIST_ARTWORK_SIZE,
    };
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.item.images, TRACK_LIST_ARTWORK_SIZE);
    },
    releasePath(): RawLocation {
      return {
        path: `/releases/${this.item.releaseId}`,
        query: { track: this.item.id },
      };
    },
    textColor(): string | undefined {
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
.TrackListItem {
  padding: 0.3em 0;

  &__action {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 1.2em;
    }
  }

  .Content {
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;

    &__left {
      display: flex;
      align-items: center;
      overflow-x: hidden;

      & > * {
        margin-right: 0.8em;
      }
    }

    &__title {
      font-size: 0.9em;

      & > *:not(:last-child) {
        margin-right: 0.3em;
      }
    }
  }
}
</style>

<style lang="scss">
.TrackListItem .v-list-item {
  &__avatar {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  &__content {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  &__action {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
}
</style>
