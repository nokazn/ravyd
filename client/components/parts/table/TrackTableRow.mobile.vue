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
        text
        ellipsis
        :artists="[...item.artists, ...item.featuredArtists]"
        :class="subtitleColor"
        class="g-small-text"
      />
    </td>

    <td :class="$style.TrackTableRow__action">
      <FavoriteButton
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :value="item.isSaved"
        @input="onFavoriteButtonClicked"
      />
      <TrackMenu
        left
        offset-x
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :track="item"
        @on-favorite-menu-clicked="onFavoriteButtonClicked"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
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
  [ON_ROW_CLICKED]: App.TrackDetail;
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail;
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail;
}

export default defineComponent({
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
    titleColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      onRowClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.TrackTableRow {
  cursor: pointer;

  &[data-is-active=true] {
    background-color: lighten($g-background-color, 16%);
  }

  &__action {
    & > *:not(:last-child) {
      margin-right: 2px;
    }
  }
}

.Content {
  &__title {
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    & > *:first-child {
      min-width: 0;
    }

    & > *:not(:first-child) {
      margin-left: 0.5rem;
      flex: 0 0 $g-explicit-chip-width;
    }
  }
}
</style>
