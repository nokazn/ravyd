<template>
  <v-list-item
    dense
    :ripple="false"
    :disabled="!item.isPlayable"
    :inactive="!item.isPlayable"
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
        <span :class="$style.Content__index">
          {{ item.index + 1 }}.
        </span>

        <div
          :class="$style.Content__title"
          class="g-ellipsis-text"
        >
          <span
            :title="item.name"
            :class="titleColor"
          >
            {{ item.name }}
          </span>
          <ExplicitChip v-if="item.explicit" />
        </div>
      </div>
    </v-list-item-content>

    <v-list-item-action>
      <div :class="$style.TrackListItem__action">
        <FavoriteButton
          :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
          :value="item.isSaved"
          @input="onFavoriteButtonClicked"
        />
        <TrackMenu
          left
          offset-x
          :track="item"
          :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
          @on-favorite-menu-clicked="onFavoriteButtonClicked"
        />
      </div>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
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
    FavoriteButton,
    ExplicitChip,
    TrackMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    artworkSrc: {
      type: String,
      default: undefined,
    },
    titleColor: {
      type: String,
      default: undefined,
    },
  },

  setup(props, { root, emit }) {
    const onItemClicked = () => {
      if (root.$screen.isSingleColumn) {
        emit(ON_MEDIA_BUTTON_CLICKED, props.item);
      }
    };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
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
      margin-right: 2px;
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

      & > *:not(:last-child) {
        margin-right: 0.5em;
      }
    }
  }
}
</style>

<style lang="scss">
.TrackListItem .v-list-item {
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
