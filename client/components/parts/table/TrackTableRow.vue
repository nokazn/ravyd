<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :id="item.hash"
      :class="$style.TrackTableRow"
      :data-is-active="isActive"
      :data-is-track-set="isTrackSet"
      @click="onRowClicked"
    >
      <td class="text-center">
        <TrackListMediaButton
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          :track-number="item.trackNumber"
          @on-clicked="onMediaButtonClicked"
        />
      </td>

      <td>
        <FavoriteButton
          :is-favorited="item.isSaved"
          @on-clicked="onFavoriteButtonClicked"
        />
      </td>

      <td :title="item.name">
        <div :class="$style.TrackTableRow__content">
          <span
            class="g-ellipsis-text"
            :class="titleColor"
            v-text="item.name"
          />
          <ExplicitChip
            v-if="item.explicit"
          />
        </div>
      </td>

      <td
        class="text-center"
        v-text="item.duration"
      />

      <td>
        <v-btn
          icon
          size="small"
          title="メニュー"
        >
          <v-icon>
            mdi-dots-horizontal
          </v-icon>
        </v-btn>
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackListMediaButton from '~/components/parts/button/TrackListMediaButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { App } from '~~/types';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_ROW_CLICKED]: App.TrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.TrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.TrackDetail
}

export default Vue.extend({
  components: {
    TrackListMediaButton,
    ExplicitChip,
    FavoriteButton,
  },

  props: {
    item: {
      type: Object as PropType<App.TrackDetail>,
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
    uri: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    titleColor(): string | undefined {
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
  },

  methods: {
    onRowClicked() {
      this.$emit(ON_ROW_CLICKED, this.item);
    },
    onMediaButtonClicked() {
      this.$emit(ON_MEDIA_BUTTON_CLICKED, this.item);
    },
    onFavoriteButtonClicked() {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, this.item);
    },
  },
});
</script>

<style lang="scss" module>
.TrackTableRow {
  cursor: pointer;
  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
