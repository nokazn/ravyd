<template>
  <v-footer
    app
    padless
    :elevation="12"
    :height="$constant.FOOTER_HEIGHT"
    :color="$constant.FOOTER_BACKGROUND_COLOR"
    :class="$style.PlayerBar"
  >
    <div :class="$style.PlayerBar__container">
      <div :class="$style.Left">
        <ReleaseArtwork
          :src="artWorkSrc(60)"
          :size="60"
          :alt="trackName"
          :title="trackName"
          :class="$style.Left__artWork"
        />

        <div :class="$style.Left__trackInfo">
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

        <FavoriteButton
          v-if="isTrack && hasTrack"
          v-model="isSavedTrack"
          :size="36"
          :class="$style.Left__favoriteButton"
        />
      </div>

      <div :class="$style.Center">
        <SeekBar :class="$style.Center__seekBar" />
        <MediaControllersWrapper :type="trackType" />
      </div>

      <div :class="$style.Right">
        <div :class="$style.Right__buttons">
          <TrackQueueMenu />
          <DeviceSelectMenu />
          <PlaybackMenu />
        </div>
        <VolumeSlider />
      </div>
    </div>

    <v-overlay
      v-if="!loaded"
      absolute
      :z-index="$constant.Z_INDEX_OF.loading"
      :color="$constant.FOOTER_BACKGROUND_COLOR"
      :opacity="1"
      :class="$style.Overlay"
    />
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import MarqueeTrackName from '~/components/parts/text/MarqueeTrackName.vue';
import MarqueeArtistNames from '~/components/parts/text/MarqueeArtistNames.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import SeekBar from '~/components/containers/player/SeekBar.vue';
import MediaControllersWrapper from '~/components/parts/wrapper/MediaControllersWrapper.vue';
import TrackQueueMenu from '~/components/containers/player/TrackQueueMenu.vue';
import DeviceSelectMenu from '~/components/containers/player/DeviceSelectMenu.vue';
import PlaybackMenu from '~/components/containers/menu/PlaybackMenu.vue';
import VolumeSlider from '~/components/containers/player/VolumeSlider.vue';

type Data = {
  deviceSelectMenu: boolean;
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

  props: {
    loaded: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      deviceSelectMenu: false,
    };
  },

  computed: {
    isAnotherDevicePlaying(): boolean {
      return this.$getters()['playback/isAnotherDevicePlaying'];
    },
    hasTrack(): RootGetters['playback/hasTrack'] {
      return this.$getters()['playback/hasTrack'];
    },
    isTrack(): boolean {
      return this.trackType === 'track';
    },

    artWorkSrc(): (size: number) => string | undefined {
      return (size: number) => this.$getters()['playback/artworkSrc'](size);
    },
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
    isSavedTrack: {
      get(): RootState['playback']['isSavedTrack'] {
        return this.$state().playback.isSavedTrack;
      },
      set(isSaved: OnFavorite['input']) {
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
  },
});
</script>

<style lang="scss" module>
$side-margin: 1vw;

.PlayerBar {
  z-index: z-index-of(footer) !important;

  &__container {
    display: grid;
    justify-content: space-between;
    align-content: center;
    grid-template-columns: 25vw 25vw;
    position: relative;
    width: 100vw;
    height: $g-footer-height;
  }
}

.Left {
  display: flex;
  align-items: center;
  margin-left: $side-margin;
  height: 100%;

  & > *:not(:last-child) {
    margin-right: 0.375em;
  }

  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-bottom: 0.375em;
    }
  }

  &__favoriteButton {
    margin-right: 0.1em;
  }
}

.Center {
  position: absolute;
  top: 47%;
  left: 50%;
  width: 40vw;
  transform: translate(-50%, -50%);

  &__seekBar {
    width: 40vw;
  }
}

.Right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-right: $side-margin;

  &__buttons {
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}

.Overlay {
  z-index: z-index-of(loading);
}
</style>
