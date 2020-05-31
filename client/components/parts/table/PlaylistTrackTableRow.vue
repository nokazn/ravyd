<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :class="$style.TrackListTableRow"
      :data-is-active="isActive"
      :data-is-track-set="isTrackSet"
      @click="onRowClicked"
    >
      <td
        :class="$style.TrackListTableRow__buttons"
        class="text-center"
      >
        <PlaylistMediaButton
          :is-hovered="isRowHovered"
          :is-playing-track="isPlayingTrack"
          @on-clicked="onMediaButtonClicked"
        />
        <FavoriteButton
          :is-favorited="item.isSaved"
          @on-clicked="onFavoriteButtonClicked"
        />
      </td>

      <td
        :class="[
          titleColor
        ]"
      >
        <div :class="$style.TrackListTableRow__content">
          <div>
            {{ item.name }}
          </div>

          <div
            class="grey--text"
            :class="$style.TrackListTableRow__contentSubtitle"
          >
            <ArtistNames
              inline
              :artist-list="item.artistList"
            /> ・ <nuxt-link
              :to="`/releases/${item.releaseId}`"
              v-text="item.releaseName"
            />
          </div>
        </div>
      </td>

      <td>
        <ExplicitChip v-if="item.explicit" />
      </td>

      <td
        :title="item.addedAt.title"
        :class="$style.TrackListTableRow__smallText"
      >
        {{ item.addedAt.overTwoWeeksAgo ? item.addedAt.yyyymd : item.addedAt.fromNow }}
      </td>

      <td
        :class="$style.TrackListTableRow__smallText"
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

import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { App } from '~~/types';

export type On = App.PlaylistTrackDetail

export default Vue.extend({
  components: {
    PlaylistMediaButton,
    ArtistNames,
    ExplicitChip,
    FavoriteButton,
  },

  props: {
    item: {
      type: Object as PropType<App.PlaylistTrackDetail>,
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
  padding: 16px 0;
  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }
  &__buttons {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__content {
    padding: 8px 0;
    & > *:not(:last-child) {
      margin-bottom: 2px
    }
    &Subtitle {
      font-size: 0.8rem!important;
    }
  }

  &__smallText {
    font-size: 0.75rem!important;
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
