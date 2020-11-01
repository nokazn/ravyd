<template>
  <v-hover v-slot="{ hover }">
    <v-list-item
      dense
      :ripple="false"
      :disabled="!item.isPlayable"
      :inactive="!item.isPlayable"
      :class="$style.TrackListItem"
      class="track-list-item"
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
          <TrackListMediaButton
            :value="playing"
            :hover="hover"
            :disabled="!item.isPlayable"
            :track-number="item.index + 1"
            @input="onMediaButtonClicked"
          />
          <FavoriteButton
            :value="item.isSaved"
            @input="onFavoriteButtonClicked"
          />
          <div
            :class="$style.Content__title"
            class="g-ellipsis-text"
          >
            <nuxt-link
              :to="releasePath"
              :title="item.name"
              :class="titleColor"
              @click.native.stop
            >
              {{ item.name }}
            </nuxt-link>

            <template v-if="item.featuredArtists.length > 0">
              <span :class="subtitleColor">-</span>
              <ArtistNames
                inline
                :artists="item.featuredArtists"
                :class="subtitleColor"
              />
            </template>
          </div>
        </div>
      </v-list-item-content>

      <v-list-item-action>
        <div :class="$style.TrackListItem__action">
          <ExplicitChip v-if="item.explicit" />
          <TrackTime
            :time-ms="item.durationMs"
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
import { defineComponent, PropType } from '@vue/composition-api';
import { RawLocation } from 'vue-router';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import { ON_MEDIA_BUTTON_CLICKED, ON_FAVORITE_BUTTON_CLICKED } from '~/components/parts/list/TrackListItem.vue';
import type { App } from '~~/types';

export type On = {
  [ON_MEDIA_BUTTON_CLICKED]:App.TrackDetail;
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail;
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
    artworkSrc: {
      type: String,
      default: undefined,
    },
    releasePath: {
      type: [String, Object] as PropType<RawLocation>,
      required: true,
    },
    titleColor: {
      type: String,
      default: undefined,
    },
    subtitleColor: {
      type: String,
      default: undefined,
    },
    buttonSize: {
      type: Number,
      required: true,
    },
  },

  setup(props, { emit }) {
    const onMediaButtonClicked = () => { emit(ON_MEDIA_BUTTON_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      onMediaButtonClicked,
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

    &__title {
      line-height: 1.4em;
      font-size: 0.9em;

      & > *:not(:last-child) {
        margin-right: 0.25em;
      }

      & > *:not(:first-child) {
        font-size: 0.875em;
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
}
</style>
