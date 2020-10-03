<template>
  <tr
    :class="{
      [$style.EpisodeTableRow]: true,
      'inactive--text': !item.isPlayable
    }"
    @click="onRowClicked"
  >
    <td>
      <div :class="$style.Content">
        <div
          :title="item.name"
          :class="[$style.Content__title, titleColor]"
        >
          <nuxt-link
            :to="episodePath"
            class="g-ellipsis-text"
            @click.native.stop
          >
            {{ item.name }}
          </nuxt-link>
          <ExplicitChip v-if="item.explicit" />
        </div>

        <div
          :class="[$style.Content__subtitle, subtitleColor]"
          class="g-ellipsis-text g-small-text"
          :title="item.description"
        >
          {{ item.description }}
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

import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
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
    ExplicitChip,
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
    addedAt: {
      type: Boolean,
      default: true,
    },
    episodePath: {
      type: String,
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
    releaseDate: {
      type: String,
      required: true,
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

  .Content {
    & > *:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    &__title {
      display: flex;
      align-items: center;

      & > *:not(:first-child) {
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
