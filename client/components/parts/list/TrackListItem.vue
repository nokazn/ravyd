<template>
  <v-hover #default="{ hover }">
    <v-list-item
      dense
      :ripple="false"
      :disabled="!item.isPlayable"
      :class="$style.TrackListItem"
      class="track-list-item"
      @click="onItemClicked"
    >
      <v-list-item-avatar tile>
        <ReleaseArtwork
          :src="artworkSrc"
          :size="$constant.TRACK_LIST_ARTWORK_SIZE"
          :alt="item.name"
          :title="item.name"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <div :class="$style.Content">
          <template v-if="$screen.isMultiColumn">
            <TrackListMediaButton
              :value="playing"
              :hover="hover"
              :track-number="item.index + 1"
              @input="onMediaButtonClicked"
            />
            <FavoriteButton
              v-if="$screen.isMultiColumn"
              :value="item.isSaved"
              @input="onFavoriteButtonClicked"
            />
          </template>
          <span
            v-else-if="$screen.isSingleColumn"
            :class="$style.Content__index"
          >
            {{ item.index + 1 }}.
          </span>

          <div
            :class="$style.Content__title"
            class="g-ellipsis-text"
          >
            <nuxt-link
              :to="releasePath"
              :title="item.name"
              :class="textColor"
              @click.native.stop
            >
              {{ item.name }}
            </nuxt-link>

            <template v-if="item.featuredArtists.length > 0 && $screen.isMultiColumn">
              <span :class="subtextColor">-</span>
              <ArtistNames
                inline
                :artists="item.featuredArtists"
                :class="subtextColor"
              />
            </template>
          </div>
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <div :class="$style.TrackListItem__action">
          <ExplicitChip v-if="item.explicit" />
          <TrackTime
            v-if="$screen.isMultiColumn"
            :time-ms="item.durationMs"
          />
          <FavoriteButton
            v-else-if="$screen.isSingleColumn"
            :size="buttonSize"
            :value="item.isSaved"
            @input="onFavoriteButtonClicked"
          />
          <TrackMenu
            offset-x
            left
            :track="item"
            :size="buttonSize"
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
import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

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
    playing: {
      type: Boolean,
      required: true,
    },
    set: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.item.images, this.$constant.TRACK_LIST_ARTWORK_SIZE);
    },
    releasePath(): RawLocation {
      return {
        path: `/releases/${this.item.releaseId}`,
        query: { track: this.item.id },
      };
    },
    textColor(): string | undefined {
      return this.set
        ? 'active--text'
        : undefined;
    },
    subtextColor(): string | undefined {
      return this.set
        ? 'active--text'
        : 'subtext--text';
    },
    buttonSize(): number {
      return this.$screen.isMultiColumn
        ? 36
        : 32;
    },
  },

  methods: {
    onMediaButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_MEDIA_BUTTON_CLICKED, { ...this.item });
    },
    onFavoriteButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, { ...this.item });
    },
    onItemClicked() {
      if (this.$screen.isSingleColumn) {
        this.onMediaButtonClicked();
      }
    },
  },
});
</script>

<style lang="scss" module>
.TrackListItem {
  // pages/artiss/artistId/index でスクロールさせるときの高さに影響
  padding: 6px 4px;

  &__action {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 0.75em;
    }
  }

  .Content {
    display: flex;
    align-items: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-right: 0.75em;
    }

    &__index {
      font-size: 0.825em;
    }

    &__title {
      font-size: 0.9em;
      line-height: 1.4em;

      & > *:not(:first-child) {
        margin-left: 0.25em;
      }
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
