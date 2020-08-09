<template>
  <v-footer
    app
    padless
    :elevation="8"
    :height="FOOTER_HEIGHT"
    :color="FOOTER_BACKGROUND_COLOR"
    :class="$style.Footer"
  >
    <div :class="$style.Footer__container">
      <div :class="$style.Footer__left">
        <ReleaseArtwork
          :src="artWorkSrc(64)"
          :size="64"
          :alt="trackName"
          :title="trackName"
          :class="$style.Footer__artWork"
        />

        <div :class="$style.Footer__trackInfo">
          <MarqueeTrackName
            v-if="hasTrack"
            :id="trackId"
            :release-id="releaseId"
            :name="trackName"
            :type="trackType"
          />

          <MarqueeArtistNames
            v-if="isTrack && hasTrack"
            :artists="artists"
          />
        </div>

        <div :class="$style.Footer__favoriteButton">
          <FavoriteButton
            v-if="isTrack && hasTrack"
            :is-favorited="isSavedTrack"
            :size="36"
            @on-clicked="onFavoriteButtonClicked"
          />
        </div>
      </div>

      <div :class="$style.Footer__center">
        <seek-bar
          :class="$style.Footer__seekBar"
        />

        <MediaControllersWrapper :type="trackType" />
      </div>

      <div :class="$style.Footer__right">
        <div :class="$style.Footer__buttons">
          <TrackQueueMenu />

          <DeviceSelectMenu />

          <PlaybackMenu />
        </div>

        <VolumeSlider />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import MarqueeTrackName from '~/components/parts/text/MarqueeTrackName.vue';
import MarqueeArtistNames from '~/components/parts/text/MarqueeArtistNames.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import SeekBar from '~/components/containers/player/SeekBar.vue';
import MediaControllersWrapper from '~/components/parts/wrapper/MediaControllersWrapper.vue';
import TrackQueueMenu from '~/components/containers/player/TrackQueueMenu.vue';
import DeviceSelectMenu from '~/components/containers/player/DeviceSelectMenu.vue';
import PlaybackMenu from '~/components/containers/menu/PlaybackMenu.vue';
import VolumeSlider from '~/components/containers/player/VolumeSlider.vue';
import { FOOTER_BACKGROUND_COLOR, FOOTER_HEIGHT } from '~/variables';

type Data = {
  deviceSelectMenu: boolean
  FOOTER_BACKGROUND_COLOR: typeof FOOTER_BACKGROUND_COLOR
  FOOTER_HEIGHT: number
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    MarqueeTrackName,
    MarqueeArtistNames,
    FavoriteButton,
    SeekBar,
    MediaControllersWrapper,
    TrackQueueMenu,
    DeviceSelectMenu,
    PlaybackMenu,
    VolumeSlider,
  },

  data(): Data {
    return {
      deviceSelectMenu: false,
      FOOTER_BACKGROUND_COLOR,
      FOOTER_HEIGHT,
    };
  },

  computed: {
    hasTrack(): RootGetters['playback/hasTrack'] {
      return this.$getters()['playback/hasTrack'];
    },
    isTrack(): boolean {
      return this.trackType === 'track';
    },
    artWorkSrc(): (size: number) => string | undefined {
      return (size: number) => this.$getters()['playback/artworkSrc'](size);
    },
    // alt 属性に渡す
    trackName(): string {
      return this.$state().playback.trackName || '不明のトラック';
    },
    trackId(): RootState['playback']['trackId'] {
      return this.$state().playback.trackId;
    },
    trackType(): RootState['playback']['trackType'] {
      return this.$state().playback.trackType;
    },
    releaseId(): RootGetters['playback/releaseId'] {
      return this.$getters()['playback/releaseId'];
    },
    artists(): RootState['playback']['artists'] {
      return this.$state().playback.artists;
    },
    isSavedTrack(): RootState['playback']['isSavedTrack'] {
      return this.$state().playback.isSavedTrack;
    },
  },

  mounted() {
    this.$dispatch('player/initPlayer');
  },

  methods: {
    onFavoriteButtonClicked(isSaved: OnFavorite['on-clicked']) {
      if (this.trackId == null) return;

      // API との通信の結果を待たずに先に表示を変更させておく
      this.$commit('playback/SET_IS_SAVED_TRACK', isSaved);
      if (isSaved) {
        this.$dispatch('library/tracks/saveTracks', [this.trackId]);
      } else {
        this.$dispatch('library/tracks/removeTracks', [this.trackId]);
      }
    },
  },
});
</script>

<style lang="scss" module>
.Footer {
  z-index: z-index-of(footer) !important;

  &__container {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 25vw 25vw;
    position: relative;
    width: 100%;
  }

  &__left {
    display: flex;
    height: 100%;
    margin-left: 1vw;

    & > *:not(:last-child) {
      margin-right: 0.3em;
    }
  }

  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-bottom: 0.75em;
    }
  }

  &__favoriteButton {
    display: flex;
    align-items: center;
    height: 100%;

    & > *:first-child {
      transform: translateY(-30%);
    }
  }

  &__center {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 40vw;
    transform: translate(-50%, -50%);
  }

  &__seekBar {
    width: 40vw;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 1vw;
  }

  &__buttons {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
