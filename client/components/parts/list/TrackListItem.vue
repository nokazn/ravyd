<template>
  <v-hover #default="{ hover }">
    <v-list-item
      dense
      :disabled="!isPlayable"
      :class="$style.TrackListItem"
      class="track-list-item"
    >
      <v-list-item-avatar tile>
        <ReleaseArtwork
          :src="artworkSrc"
          :size="40"
          :alt="name"
          :title="name"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <div :class="$style.TrackListItem__content">
          <div :class="$style['TrackListItem__content--left']">
            <TrackListMediaButton
              :is-hovered="hover"
              :is-playing-track="isPlayingTrack"
              :track-number="trackIndex"
              @on-clicked="onMediaButtonClicked"
            />

            <FavoriteButton
              :is-favorited="isSaved"
              @on-clicked="onFavoriteButtonClicked"
            />

            <span
              :class="$style.TrackListItem__contentTitle"
              class="g-ellipsis-text"
            >
              <nuxt-link
                :to="path"
                :title="name"
                :class="textColor"
              >
                {{ name }}
              </nuxt-link>

              <template v-if="featuredArtistList.length > 0">
                <span :class="subtextColor">-</span>
                <ArtistNames
                  :artist-list="featuredArtistList"
                  inline
                  :class="subtextColor"
                />
              </template>
            </span>
          </div>
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <div :class="$style.TrackListItem__action">
          <ExplicitChip v-if="explicit" />

          <TrackTime :time-ms="durationMs" />

          <v-btn icon>
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </div>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import { hasProp } from '~~/utils/hasProp';
import { App, SpotifyAPI } from '~~/types';

export type Data = {
  path: string
  trackIndex: number
}

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_MEDIA_BUTTON_CLICKED]: {
    index: number
    id: string
    uri: string
  }
  [ON_FAVORITE_BUTTON_CLICKED]: {
    index: number
    id: string
    nextSavedState: boolean
  }
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
    TrackListMediaButton,
    FavoriteButton,
    ExplicitChip,
    TrackTime,
  },

  props: {
    index: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
    releaseName: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    artworkSrc: {
      type: String,
      required: true,
    },
    trackNumber: {
      type: Number,
      required: true,
    },
    discNumber: {
      type: Number,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    featuredArtistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    explicit: {
      type: Boolean,
      required: true,
    },
    isPlayable: {
      type: Boolean,
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    externalUrls: {
      type: Object as PropType<SpotifyAPI.ExternalUrls>,
      required: true,
    },
    previewUrl: {
      type: String,
      required: true,
    },
    isSaved: {
      type: Boolean,
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
    const path = `/releases/${this.releaseId}#${this.hash}`;
    const trackIndex = this.index + 1;
    return {
      path,
      trackIndex,
    };
  },

  computed: {
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
      this.$emit(ON_MEDIA_BUTTON_CLICKED, {
        index: this.index,
        id: this.id,
        uri: this.uri,
      });
    },
    onFavoriteButtonClicked(nextSavedState: boolean) {
      const { id, index } = this;
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, {
        index,
        id,
        nextSavedState,
      });
    },
  },
});
</script>

<style lang="scss" module>
.TrackListItem {
  padding: 0.3em 0;

  &__content {
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;

    &--left {
      display: flex;
      align-items: center;
      overflow-x: hidden;

      & > * {
        margin-right: 12px;
      }
    }

    &Title {
      font-size: 0.9rem;
      line-height: 1.1rem;

      & > *:not(:last-child) {
        margin-right: 4px;
      }
    }
  }

  &__action {
    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>

<style lang="scss">
.track-list-item .v-list-item {
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
