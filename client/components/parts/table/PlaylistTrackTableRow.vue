<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr
      :class="{
        [$style.PlaylistTrackTableRow]: true,
        'inactive--text': disabled
      }"
      :data-is-active="isActive"
      @click="onRowClicked"
    >
      <td>
        <div
          :class="$style.PlaylistTrackTableRow__buttons"
          class="text-center"
        >
          <PlaylistMediaButton
            :is-hovered="isRowHovered"
            :is-playing-track="isPlayingTrack"
            :disabled="disabled"
            @on-clicked="onMediaButtonClicked"
          />

          <FavoriteButton
            v-if="item.type !== 'episode'"
            :is-favorited="item.isSaved"
            @on-clicked="onFavoriteButtonClicked"
          />
        </div>
      </td>

      <td>
        <div :class="$style.Content">
          <div>
            <div
              :class="titleColor"
              class="g-ellipsis-text"
              :title="item.name"
            >
              <span v-if="item.type !== 'episode'">
                {{ item.name }}
              </span>
              <nuxt-link
                v-else
                :to="`/episodes/${item.id}`"
              >
                {{ item.name }}
              </nuxt-link>
            </div>

            <div
              :class="[$style.Content__subtitle, subtitleColor]"
              class="g-ellipsis-text"
            >
              <template v-if="item.type !== 'episode'">
                <ArtistNames
                  inline
                  :artist-list="item.artistList"
                />

                <span :class="$style['Content__subtitle--divider']">-</span>

                <nuxt-link
                  :to="`/releases/${item.releaseId}`"
                  :title="item.releaseName"
                >
                  {{ item.releaseName }}
                </nuxt-link>
              </template>
              <nuxt-link
                v-else
                :to="`/shows/${item.releaseId}`"
                :title="item.releaseName"
              >
                {{ item.releaseName }}
              </nuxt-link>
            </div>
          </div>

          <div>
            <ExplicitChip v-if="item.explicit" />
          </div>
        </div>
      </td>

      <td
        v-if="isAddedByShown"
        :class="$style.PlaylistTrackTableRow__smallText"
        class="g-ellipsis-text"
      >
        <nuxt-link
          :to="`/users/${item.addedBy.id}`"
        >
          {{ item.addedBy.display_name || item.addedBy.id }}
        </nuxt-link>
      </td>

      <td
        v-if="addedAt"
        :title="item.addedAt.title"
        :class="$style.PlaylistTrackTableRow__smallText"
      >
        <time
          v-if="item.addedAt.text"
          :datetime="item.addedAt.text"
        >
          {{ item.addedAt.text }}
        </time>
      </td>

      <td
        :class="$style.PlaylistTrackTableRow__smallText"
        class="text-center"
      >
        <TrackTime :time-ms="item.durationMs" />
      </td>

      <td>
        <EpisodeMenu
          v-if="item.type === 'episode'"
          offset-x
          left
          :episode="item"
          :playlist-id="playlistId"
          :publisher="publisher"
        />
        <TrackMenu
          v-else
          offset-x
          left
          :track="item"
          :playlist-id="playlistId"
          @on-favorite-menu-clicked="onFavoriteButtonClicked"
        />
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import TrackTime from '~/components/parts/text/TrackTime.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
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
    PlaylistMediaButton,
    FavoriteButton,
    ArtistNames,
    ExplicitChip,
    TrackTime,
    TrackMenu,
    EpisodeMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.PlaylistTrackDetail>,
      required: true,
    },
    playlistId: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    isTrackSet: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
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
    collaborative: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    /**
     * @todo
     * エピソードは isPlayable が false でも再生できるようにしている
     */
    disabled(): boolean {
      return this.item.type !== 'episode' && !this.item.isPlayable;
    },
    publisher(): string {
      return this.item.artistList
        .map((artist) => artist.name)
        .join(', ');
    },
    isAddedByShown(): boolean {
      return this.collaborative && this.item.addedBy != null;
    },
    titleColor(): string | undefined {
      if (this.disabled) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : undefined;
    },
    subtitleColor(): string {
      if (this.disabled) return 'inactive--text';
      return this.isTrackSet
        ? 'active--text'
        : 'subtext--text';
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
.PlaylistTrackTableRow {
  cursor: pointer;
  padding: 1em 0;

  &[data-is-active=true] {
    background-color: lighten($g-data-table-background-color, 15%);
  }

  &__buttons {
    display: flex;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
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
