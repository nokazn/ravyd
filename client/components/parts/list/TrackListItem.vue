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
            left
            offset-x
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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import { useButtonSize } from '~/services/use/style';
import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_MEDIA_BUTTON_CLICKED]:App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export default defineComponent({
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

  setup(props, { root, emit }) {
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      root.$constant.TRACK_LIST_ARTWORK_SIZE,
    ));
    const releasePath = computed<RawLocation>(() => ({
      path: `/releases/${props.item.releaseId}`,
      query: { track: props.item.id },
    }));
    const textColor = computed(() => (props.set ? 'active--text' : undefined));
    const subtextColor = computed(() => (props.set ? 'active--text' : 'subtext--text'));
    const buttonSize = useButtonSize(root);

    // row をコピーしたものを参照する
    const onMediaButtonClicked = () => { emit(ON_MEDIA_BUTTON_CLICKED, { ...props.item }); };
    const onItemClicked = () => {
      if (root.$screen.isSingleColumn) {
        emit(ON_MEDIA_BUTTON_CLICKED, { ...props.item });
      }
    };
    // row をコピーしたものを参照する
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, { ...props.item }); };

    return {
      artworkSrc,
      releasePath,
      textColor,
      subtextColor,
      buttonSize,
      onMediaButtonClicked,
      onItemClicked,
      onFavoriteButtonClicked,
    };
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
      margin-right: 1em;
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
