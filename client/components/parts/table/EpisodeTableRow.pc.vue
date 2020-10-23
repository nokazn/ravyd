<template>
  <tr
    :class="{
      [$style.EpisodeTableRow]: true,
      'inactive--text': !item.isPlayable
    }"
    @click="onRowClicked"
  >
    <td
      :class="$style.EpisodeTableRow_buttons"
      class="text-center"
    >
      <PlaylistMediaButton
        :disabled="!item.isPlayable"
        :value="playing"
        @input="onMediaButtonClicked"
      />
    </td>

    <td>
      <div :class="$style.Content">
        <div
          :class="$style.Content__left"
          class="g-ellipsis-text"
        >
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
            class="g-small-text g-ellipsis-text"
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
    >
      <time
        :datetime="item.releaseDate"
        class="g-small-text"
      >
        {{ releaseDate }}
      </time>
    </td>

    <td class="text-center g-small-text">
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
import { defineComponent, PropType } from '@vue/composition-api';
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import {
  ON_ROW_CLICKED,
  ON_MEDIA_BUTTON_CLICKED,
  ON_FAVORITE_BUTTON_CLICKED,
} from '~/components/parts/table/EpisodeTableRow.vue';
import type { App } from '~~/types';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail
  [ON_MEDIA_BUTTON_CLICKED]: App.PlaylistTrackDetail
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail
}

export default defineComponent({
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
    playing: {
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

  setup(props, { emit }) {
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    const onMediaButtonClicked = () => { emit(ON_MEDIA_BUTTON_CLICKED, props.item); };
    const onFavoriteButtonClicked = () => { emit(ON_FAVORITE_BUTTON_CLICKED, props.item); };

    return {
      onRowClicked,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.EpisodeTableRow {
  .Content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:not(:first-child) {
      margin-left: 0.25rem;
    }

    &__left {
      & > *:not(:last-child) {
        margin-bottom: 0.25rem;
      }
    }

    &__subtitle {
      &--divider {
        margin: 0 0.25rem;
      }
    }
  }
}
</style>
