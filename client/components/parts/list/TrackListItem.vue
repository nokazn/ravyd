<template>
  <v-hover #default="{ hover }">
    <v-list-item
      dense
      :class="$style.TrackListItem"
      class="track-list-item">
      <v-list-item-avatar tile>
        <release-artwork
          :src="artworkSrc"
          :size="40"
          :alt="name"
          :title="name" />
      </v-list-item-avatar>

      <v-list-item-content>
        <div :class="$style.TrackListItem__content">
          <track-list-media-button
            :is-hovered="hover"
            :is-playing-track="isPlayingTrack"
            :track-number="trackIndex"
            @on-clicked="onMediaButtonClicked" />

          <favorite-button
            :is-favorited="isSaved"
            @on-clicked="onFavoriteButtonClicked" />

          <nuxt-link
            :to="path"
            :class="[
              $style.TrackListItem__contentTitle,
              textColor,
            ]"
            v-text="name" />

          <v-list-item-subtitle v-if="hasSubtitle">
            <artist-names :artist-list="artistList" />
          </v-list-item-subtitle>
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <div :class="$style.TrackListItem__action">
          <explicit-chip v-if="explicit" />
          <span
            :class="$style.TrackListItem__actionDuration"
            v-text="duration" />
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
import { hasProp } from '~~/utils/hasProp';
import { App } from '~~/types';

export type TrackDetail = App.TrackDetail

export type Data = {
  path: string
  trackIndex: number
}

export namespace On {
  export type OnMediaButtonClicked = {
    index: number
    id: string
  }
  export type OnFavoriteButtonClicked = {
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
  },

  props: {
    index: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
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
    releaseId: {
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
    artistList: {
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
    isSaved: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    hasSubtitle: {
      type: Boolean,
      default: false,
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
    const hash = `#${this.discNumber}-${this.trackNumber}`;
    const path = `/releases/${this.releaseId}${hash}`;
    const trackIndex = this.index + 1;
    return {
      path,
      trackIndex,
    };
  },

  computed: {
    textColor(): string | undefined {
      return this.isTrackSet
        ? 'cyan--text text--accent-2'
        : undefined;
    },
  },

  methods: {
    onMediaButtonClicked() {
      this.$emit('on-media-button-clicked', {
        id: this.id,
        index: this.index,
      });
    },
    onFavoriteButtonClicked(nextSavedState: boolean) {
      const { id, index } = this;
      this.$emit('on-favorite-button-clicked', {
        nextSavedState,
        id,
        index,
      });
    },
  },
});
</script>

<style lang="scss" module>
.TrackListItem {
  padding: .3em 0;
  &__content {
    display: flex;
    align-items: center;
    & > *:not(:last-child) {
      margin-right: 1.5%;
    }
    &Title {
      font-size: 0.85rem;
    }
  }
  &__action {
    & > *:not(:last-child) {
      margin-right: 16px;
    }
    &Duration {
      font-size: 0.75rem;
    }
  }
}
</style>

<style lang="scss">
.track-list-item .v-list-item{
  &__avatar {
    margin-top: 0!important;
    margin-bottom: 0!important;
  }
  &__content {
    padding-top: 0!important;
    padding-bottom: 0!important;
  }
  &__action {
    margin-top: 0!important;
    margin-bottom: 0!important;
  }
}
</style>
