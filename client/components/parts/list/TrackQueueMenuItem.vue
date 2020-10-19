<template>
  <v-list-item
    dense
    two-line
    :title="`${item.name} を再生`"
    :class="$style.TrackQueueMenuItem"
    @click="onItemClicked"
  >
    <v-list-item-avatar tile>
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="item.name"
        :title="item.name"
        :size="40"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title
        :class="[
          $style.TrackQueueMenuItem__title,
          item.isSet ? 'active--text' : undefined
        ]"
        class="g-ellipsis-text"
      >
        {{ item.name }}
      </v-list-item-title>

      <v-list-item-subtitle
        :class="[
          $style.TrackQueueMenuItem__subtitle,
          item.isSet ? 'active--text' : 'subtext--text'
        ]"
      >
        <template v-if="item.type === 'track'">
          <ArtistNames
            inline
            ellipsis
            :artists="item.artists"
            @click="onLinkClicked"
          />
          <span>-</span>
        </template>
        <nuxt-link
          :to="releasePath"
          :title="item.releaseName"
          class="g-ellipsis-text"
          @click.native.stop="onLinkClicked"
        >
          {{ item.releaseName }}
        </nuxt-link>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action :class="$style.TrackQueueMenuItem__action">
      <TrackTime
        v-if="item.durationMs != null"
        :time-ms="item.durationMs"
        :class="item.isSet ? 'active--text' : 'subtext--text'"
      />
      <v-icon
        v-show="item.isPlaying"
        color="active"
        title="再生中"
        :size="16"
      >
        mdi-volume-high
      </v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

const ON_ITEM_CLICKED = 'on-item-clicked';
const ON_LINK_CLICKED = 'on-link-clicked';

export type On = {
  [ON_ITEM_CLICKED]: {
    index: number;
    uri: string;
  }
  [ON_LINK_CLICKED]: void;
}

export default defineComponent({
  components: {
    ReleaseArtwork,
    ArtistNames,
    TrackTime,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackQueueInfo>,
      required: true,
    },
  },

  setup(props, { root, emit }) {
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      root.$constant.TRACK_LIST_ARTWORK_SIZE,
    ));
    const releasePath = computed(() => `/releases/${props.item.releaseId}`);
    const onItemClicked = () => {
      emit(ON_ITEM_CLICKED, {
        index: props.item.index,
        uri: props.item.uri,
      });
    };
    const onLinkClicked = () => { emit(ON_LINK_CLICKED); };

    return {
      artworkSrc,
      releasePath,
      onItemClicked,
      onLinkClicked,
    };
  },
});
</script>

<style lang="scss" module>
.TrackQueueMenuItem {
  &__title {
    font-size: 0.85rem !important;
  }

  &__subtitle {
    font-size: 0.8rem !important;

    & > *:not(:last-child) {
      margin-right: 0.25rem;
    }
  }

  &__action {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin: 8px 0;
  }
}
</style>
