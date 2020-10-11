<template>
  <v-list-item
    dense
    three-line
    :title="`${name} を再生`"
    :class="$style.TrackQueueMenuItem"
    @click="onItemClicked"
  >
    <v-list-item-avatar tile>
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="name"
        :title="name"
        :size="40"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title
        :class="[
          $style.TrackQueueMenuItem__title,
          isSet ? 'active--text' : undefined
        ]"
        class="g-ellipsis-text"
      >
        {{ name }}
      </v-list-item-title>

      <v-list-item-subtitle
        :class="[
          isSet ? 'active--text' : 'subtext--text'
        ]"
      >
        <nuxt-link
          :to="releasePath"
          :title="releaseName"
          class="g-ellipsis-text"
          @click.native.stop="onLinkClicked"
        >
          {{ releaseName }}
        </nuxt-link>
      </v-list-item-subtitle>

      <v-list-item-subtitle
        :class="[
          $style.TrackQueueMenuItem__artistNames,
          isSet ? 'active--text' : 'subtext--text'
        ]"
      >
        <ArtistNames
          ellipsis
          :artists="artists"
          @click="onLinkClicked"
        />
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action :class="$style.TrackQueueMenuItem__action">
      <TrackTime
        v-if="durationMs != null"
        :time-ms="durationMs"
        :class="isSet ? 'active--text' : 'subtext--text'"
      />
      <v-icon
        v-show="isPlaying"
        :size="20"
        color="active"
        title="再生中"
      >
        mdi-volume-high
      </v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import { getImageSrc } from '~/utils/image';
import { App, SpotifyAPI } from '~~/types';

const ON_ITEM_CLICKED = 'on-item-clicked';
const ON_LINK_CLICKED = 'on-link-clicked';

export type On = {
  [ON_ITEM_CLICKED]: {
    index: number
    uri: string
  }
  [ON_LINK_CLICKED]: void
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
    TrackTime,
  },

  props: {
    isSet: {
      type: Boolean,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    uri: {
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
    artists: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
    },
    images: {
      type: Array as PropType<SpotifyAPI.Image[]>,
      default: undefined,
    },
    durationMs: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.images, this.$constant.TRACK_LIST_ARTWORK_SIZE);
    },
    releasePath(): string {
      return `/releases/${this.releaseId}`;
    },
  },

  methods: {
    onItemClicked() {
      this.$emit(ON_ITEM_CLICKED, {
        index: this.index,
        uri: this.uri,
      });
    },
    onLinkClicked() {
      this.$emit(ON_LINK_CLICKED);
    },
  },
});
</script>

<style lang="scss" module>
.TrackQueueMenuItem {
  &__title {
    font-size: 0.85rem !important;
  }

  &__artistNames {
    margin-top: -2px;
  }

  &__action {
    & > *:not(:last-child) {
      margin-bottom: 0.4em;
    }
  }
}
</style>
