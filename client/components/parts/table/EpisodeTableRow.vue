<template>
  <tr
    :class="{
      [$style.EpisodeTableRow]: true,
      'inactive--text': !item.isPlayable
    }"
    :data-is-active="isActive"
    @click="onRowClicked"
  >
    <td
      :class="$style.EpisodeTableRow_buttons"
      class="text-center"
    >
      <PlaylistMediaButton
        :is-playing-track="isPlayingEpisode"
        :disabled="!item.isPlayable"
        @on-clicked="onMediaButtonClicked"
      />
    </td>

    <td>
      <div :class="$style.Content">
        <div class="g-ellipsis-text">
          <div
            :class="titleColor"
            class="g-ellipsis-text"
            :title="item.name"
          >
            <nuxt-link :to="episodePath">
              {{ item.name }}
            </nuxt-link>
          </div>

          <div
            :class="[$style.Content__subtitle, subtitleColor]"
            class="g-ellipsis-text"
            :title="item.description"
          >
            {{ item.description }}
          </div>
        </div>

        <div>
          <ExplicitChip v-if="item.explicit" />
        </div>
      </div>
    </td>

    <td>
      <EpisodeProgressBar
        :resume-point="item.resumePoint"
        :duration-ms="item.durationMs"
        :max-width="56"
      />
    </td>

    <td
      :title="releaseDate"
      :class="$style.EpisodeTableRow__smallText"
    >
      <time :datetime="item.releaseDate">
        {{ releaseDate }}
      </time>
    </td>

    <td
      :class="$style.EpisodeTableRow__smallText"
      class="text-center"
    >
      <TrackTime :time-ms="item.durationMs" />
    </td>

    <td>
      <EpisodeMenu
        offset-x
        left
        :episode="item"
        :publisher="publisher"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import { convertReleaseDate } from '~/utils/converter';
import { App } from '~~/types';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.PlaylistTrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail
}

export default Vue.extend({
  components: {
    PlaylistMediaButton,
    ExplicitChip,
    TrackTime,
    EpisodeProgressBar,
    EpisodeMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.EpisodeDetail>,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    isEpisodeSet: {
      type: Boolean,
      required: true,
    },
    isPlayingEpisode: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    addedAt: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    episodePath(): string {
      return `/episodes/${this.item.id}`;
    },
    titleColor(): string | undefined {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.isEpisodeSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (!this.item.isPlayable) return 'inactive--text';
      return this.isEpisodeSet
        ? 'active--text'
        : 'subtext--text';
    },
    releaseDate(): string {
      return convertReleaseDate({
        releaseDate: this.item.releaseDate,
        releaseDatePrecision: this.item.releaseDatePrecision,
        format: 'YYYY/M/D',
      });
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
.EpisodeTableRow {
  cursor: pointer;
  padding: 1em 0;

  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }

  &__buttons {
    display: flex;
  }

  &__smallText {
    font-size: 0.75em !important;
    white-space: nowrap;
    padding: 0 0.25em !important;
  }

  .Content {
    padding: 0.8em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:not(:last-child) {
      margin-right: 1em;
    }

    &__subtitle {
      margin-top: 0.3em;
      font-size: 0.9em;

      &--divider {
        margin: 0 0.3em;
      }
    }
  }
}
</style>
