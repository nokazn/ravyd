<template>
  <v-hover #default="{ hover }">
    <v-list-item
      dense
      :disabled="!item.isPlayable"
      :class="$style.TrackListItem"
      class="track-list-item"
    >
      <v-list-item-avatar tile>
        <ReleaseArtwork
          :src="item.artworkSrc"
          :size="40"
          :alt="item.name"
          :title="item.name"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <div :class="$style.TrackListItem__content">
          <div :class="$style['TrackListItem__content--left']">
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

            <span
              :class="$style.TrackListItem__contentTitle"
              class="g-ellipsis-text"
            >
              <nuxt-link
                :to="path"
                :title="item.name"
                :class="textColor"
              >
                {{ item.name }}
              </nuxt-link>

              <template v-if="item.featuredArtistList.length > 0">
                <span :class="subtextColor">-</span>
                <ArtistNames
                  :artist-list="item.featuredArtistList"
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
          <ExplicitChip v-if="item.explicit" />

          <TrackTime :time-ms="item.durationMs" />

          <TrackMenu
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

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import { App } from '~~/types';

export type Data = {
  path: string
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
    const path = `/releases/${this.item.releaseId}#${this.item.hash}`;

    return {
      path,
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
