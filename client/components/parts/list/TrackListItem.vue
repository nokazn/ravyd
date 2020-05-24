<template>
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
        <v-btn icon small>
          <v-icon :size="18">
            mdi-play
          </v-icon>
        </v-btn>

        <favorite-button
          :is-favorited="isSaved"
          @on-clicked="onFavoriteButtonClicked" />

        <nuxt-link
          :to="path"
          :class="$style.TrackListItem__contentTitle"
          v-text="name" />

        <v-list-item-subtitle v-if="hasSubtitle">
          <artist-names :artist-list="artistList" />
        </v-list-item-subtitle>
      </div>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon>
        <v-icon>
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { hasProp } from '~~/utils/hasProp';
import { App } from '~~/types';

export type TrackDetail = App.TrackDetail

export type Data = {
  path: string
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
    FavoriteButton,
  },

  props: {
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
  },

  data(): Data {
    const hash = `#${this.discNumber}-${this.trackNumber}`;
    const path = `/releases/${this.releaseId}${hash}`;
    return {
      path,
    };
  },

  methods: {
    onFavoriteButtonClicked(nextSavedState: boolean) {
      const { id } = this;
      this.$emit('on-favorite-button-clicked', {
        nextSavedState,
        id,
      });
      console.log({ nextSavedState, id });
    },
  },
});
</script>

<style lang="scss" module>
.TrackListItem {
  padding: .3em 0;
  &__content {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
    &Title {
      font-size: 0.85rem;
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
