<template>
  <tr
    :class="{
      [$style.TrackTableRow]: true,
      'inactive--text': !item.isPlayable
    }"
    :data-is-active="active"
    @click="onRowClicked"
  >
    <td
      :title="item.name"
      :class="$style.Content"
    >
      <div
        :class="[$style.Content__title, titleColor]"
        class="g-ellipsis-text"
      >
        <span class="g-ellipsis-text">
          {{ item.name }}
        </span>
        <ExplicitChip v-if="item.explicit" />
      </div>

      <ArtistNames
        :artists="[...item.artists, ...item.featuredArtists]"
        :class="subtextColor"
        class="g-small-text g-ellipsis-text"
      />
    </td>

    <td>
      <FavoriteButton
        :size="buttonSize"
        :value="item.isSaved"
        @input="onFavoriteButtonClicked"
      />
    </td>

    <td>
      <TrackMenu
        left
        offset-x
        :size="buttonSize"
        :track="item"
        @on-favorite-menu-clicked="onFavoriteButtonClicked"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import {
  ON_ROW_CLICKED,
  ON_MEDIA_BUTTON_CLICKED,
  ON_FAVORITE_BUTTON_CLICKED,
} from '~/components/parts/table/TrackTableRow.vue';
import type { App } from '~~/types';

export type On = {
  [ON_ROW_CLICKED]: App.TrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export default Vue.extend({
  components: {
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    isTrackSet: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    buttonSize: {
      type: Number,
      default: 36,
    },
    titleColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    subtextColor: {
      type: String,
      required: true,
    },
  },

  methods: {
    onRowClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_ROW_CLICKED, { ...this.item });
    },
    onMediaButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_MEDIA_BUTTON_CLICKED, { ...this.item });
    },
    onFavoriteButtonClicked() {
      // row をコピーしたものを参照する
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, { ...this.item });
    },
  },
});
</script>

<style lang="scss" module>
.TrackTableRow {
  cursor: pointer;

  &[data-is-active=true] {
    background-color: lighten($g-background-color, 16%);
  }
}

.Content {
  &__title {
    display: flex;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 0.75rem;
    }
  }
}
</style>
