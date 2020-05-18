<template>
  <v-footer
    app
    padless
    :height="80"
    :class="$style.Footer">
    <div :class="$style.Footer__container">
      <div :class="$style.Footer__left">
        <release-art-work
          v-if="artWorkSrc"
          :src="artWorkSrc"
          alt="current-track-art-work"
          :size="80"
          :class="$style.Footer__artWork" />

        <div :class="$style.Footer__trackInfo">
          <release-name
            v-if="trackName != null"
            :name="trackName"
            :release-id="albumId" />
          <marquee-artist-name :artist-list="artistList" />
        </div>

        <div :class="$style.Footer__favoriteButton">
          <favorite-button
            :is-favorited="isSavedTrack"
            :size="20"
            @on-clicked="onFavoriteButtonClicked" />
        </div>
      </div>

      <div :class="$style.Footer__center">
        <seek-bar
          :class="$style.Footer__seekBar"
          @on-change="onSeekbarChanged" />
        <media-controllers :class="$style.Footer__mediaControllers" />
      </div>

      <div :class="$style.Footer__right">
        <div>
          <v-btn icon>
            <v-icon :size="20">
              mdi-playlist-play
            </v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon :size="20">
              mdi-devices
            </v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon :size="20">
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </div>

        <volume-slider
          @on-change="onVolumuChanged" />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'vuex';

import ReleaseArtWork from '~/components/parts/avatar/ReleaseArtWork.vue';
import ReleaseName from '~/components/parts/text/ReleaseName.vue';
import MarqueeArtistName, { Artists } from '~/components/parts/text/MarqueeArtistName.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';

import SeekBar from '~/components/containers/player/SeekBar.vue';
import MediaControllers from '~/components/containers/player/MediaControllers.vue';
import VolumeSlider from '~/components/containers/player/VolumeSlider.vue';

export default Vue.extend({
  components: {
    ReleaseArtWork,
    ReleaseName,
    MarqueeArtistName,
    FavoriteButton,
    SeekBar,
    MediaControllers,
    VolumeSlider,
  },

  computed: {
    artWorkSrc(): RootState['player']['artWorkSrc'] {
      return this.$state().player.artWorkSrc;
    },
    trackName(): RootState['player']['trackName'] {
      return this.$state().player.trackName;
    },
    trackId(): RootState['player']['trackId'] {
      return this.$state().player.trackId;
    },
    albumId(): RootGetters['player/albumId'] {
      return this.$getters()['player/albumId'];
    },
    artistList(): Artists | null {
      return this.$state().player.artistList;
    },
    isSavedTrack(): boolean {
      return this.$state().player.isSavedTrack;
    },
  },

  // player を初期化してからアクティブなデバイスを取得する
  async mounted() {
    await this.$dispatch('player/initPlayer');
    this.$dispatch('player/getActiveDeviceList');
  },

  methods: {
    async onFavoriteButtonClicked(isSaved: boolean) {
      if (this.trackId == null) return;

      // API との通信の結果を待たずに先に表示を変更させておく
      this.$commit('player/SET_IS_SAVED_TRACK', isSaved);
      if (isSaved) {
        await this.$dispatch('library/saveTracks', [this.trackId]);
      } else {
        await this.$dispatch('library/removeTracks', [this.trackId]);
      }
    },
    onSeekbarChanged(position: number) {
      this.$dispatch('player/seek', position);
    },
    onVolumuChanged(volume: number) {
      this.$dispatch('player/volume', volume);
    },
  },
});
</script>

<style lang="scss" module>
.Footer {
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
    & > *:not(:last-child) {
      margin-right: 4px;
    }
  }
  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;
    & > *:not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__favoriteButton {
    display: flex;
    align-items: center;
    transform: translateY(-12px);
    height: 100%;
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
  &__mediaControllers {
    margin-top: -20px;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 8%;
    & > *:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>
