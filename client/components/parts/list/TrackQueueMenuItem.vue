<template>
  <v-list-item
    dense
    three-line
    :input-valuea="id"
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

    <v-list-item-content :class="$style.TrackQueueMenuItem__content">
      <div>
        <div
          :class="[
            $style.TrackQueueMenuItem__title,
            isSet ? 'active--text' : undefined,
          ]"
          class="g-ellipsis-text"
        >
          {{ name }}
        </div>

        <v-list-item-subtitle
          :class="[
            $style.TrackQueueMenuItem__subtitle,
            isSet ? 'active--text' : 'subtext--text',
          ]"
        >
          <nuxt-link
            :to="`/releases/${releaseId}`"
            :title="releaseName"
            class="g-ellipsis-text"
            @click.native.stop="onLinkClicked"
          >
            {{ releaseName }}
          </nuxt-link>

          <ArtistNames
            :artist-list="artistList"
            :title="artistNames"
            class="g-ellipsis-text"
            @on-clicked="onLinkClicked"
          />
        </v-list-item-subtitle>
      </div>

      <v-icon
        v-show="isPlaying"
        :size="20"
        color="active"
        title="再生中"
      >
        mdi-volume-high
      </v-icon>
    </v-list-item-content>

    <v-list-item-action>
      <TrackTime
        v-if="durationMs != null"
        :time-ms="durationMs"
        :class="isSet ? 'active--text' : 'subtext--text'"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import { App } from '~~/types';

type Data = {
  artistNames: string
}

const ON_ITEM_CLICKED = 'on-item-clicked';
const ON_LINK_CLICKED = 'on-link-clicked';

export type On = {
  [ON_ITEM_CLICKED]: string
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
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
    },
    artworkSrc: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    durationMs: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const artistNames = this.artistList
      .map((artist) => artist.name)
      .join(', ');

    return {
      artistNames,
    };
  },

  methods: {
    onItemClicked() {
      this.$emit(ON_ITEM_CLICKED, this.uri);
    },
    onLinkClicked() {
      this.$emit(ON_LINK_CLICKED);
    },
  },
});
</script>

<style lang="scss" module>
.TrackQueueMenuItem {
  &__content {
    display: grid;
    grid-template-columns: auto 20px;
    column-gap: 12px;

    & > *:first-child {
      overflow-x: hidden;
    }
  }

  &__title {
    font-size: 0.9em;
    line-height: 1.2rem;
  }

  &__subtitle {
    font-size: 0.7em !important;
  }
}
</style>
