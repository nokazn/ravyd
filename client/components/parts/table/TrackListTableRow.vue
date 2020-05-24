<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :id="item.hash"
      :class="$style.TrackListTableRow"
      :data-is-active="isActive"
      :data-is-track-set="isTrackSet"
      @click="onRowClicked">
      <td
        :class="[
          $style.TrackListTableRow__id,
          'text-center'
        ]">
        <track-list-media-button
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          :track-number="item.trackNumber"
          @on-clicked="onMediaButtonClicked" />
      </td>

      <td>
        <favorite-button
          :is-favorited="item.isSaved"
          @on-clicked="onFavoriteButtonClicked" />
      </td>

      <td
        :class="[
          $style.TrackListTableRow__name,
          titleColor
        ]"
        v-text="item.name" />

      <td>
        <explicit-chip v-if="item.explicit" />
      </td>

      <td v-text="item.duration" />

      <td>
        <v-btn
          icon
          size="small"
          title="メニュー">
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
        ? 'cyan--text  text--accent-2'
        : undefined;
    },
  },

  methods: {
    onRowClicked() {
      this.$emit('on-row-clicked', this.item);
    },
    onMediaButtonClicked() {
      this.$emit('on-media-button-clicked', this.item);
    },
    onFavoriteButtonClicked() {
      this.$emit('on-favorite-button-clicked', this.item);
    },
  },
});
</script>

<style lang="scss" module>
.TrackListTableRow {
  cursor: pointer;
  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }
  &__id {
    width: 60px;
  }
}
</style>

<style lang="scss">
tr {
  td {
    padding: 0 12px;
  }
}
</style>
