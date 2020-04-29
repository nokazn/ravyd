<template>
  <v-footer
    fixed
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
            :release-id="trackId" />
          <artist-name :artist-list="artistList" />
        </div>
      </div>

      <div :class="$style.Footer__center">
        <seek-bar
          :class="$style.Footer__seekBar"
          @on-change="onSeekbarChanged" />
        <media-controller />
      </div>

      <div :class="$style.Footer__right">
        <div>
          <v-btn
            icon
            small>
            <v-icon :size="16">
              mdi-playlist-play
            </v-icon>
          </v-btn>

          <v-btn
            icon
            small>
            <v-icon :size="16">
              mdi-devices
            </v-icon>
          </v-btn>

          <v-btn
            icon
            small>
            <v-icon :size="16">
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </div>

        <volume-slider />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

import ReleaseArtWork from '~/components/parts/avatar/ReleaseArtWork.vue';
import ReleaseName from '~/components/parts/text/ReleaseName.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import SeekBar from '~/components/parts/player/SeekBar.vue';
import MediaController from '~/components/parts/player/MediaController.vue';
import VolumeSlider from '~/components/parts/player/VolumeSlider.vue';

export default Vue.extend({
  components: {
    ReleaseArtWork,
    ReleaseName,
    ArtistName,
    SeekBar,
    MediaController,
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
    artistList(): Artists | null {
      return this.$state().player.artistList;
    },
  },

  // player を初期化してからアクティブなデバイスを取得する
  async mounted() {
    await this.$dispatch('player/initPlayer');
    this.$dispatch('player/getActiveDeviceList');
  },

  methods: {
    onSeekbarChanged(position: number) {
      this.$dispatch('player/seek', position);
    },
  },
});
</script>

<style lang="scss" module>
.Footer {
  position: relative;
  &__container {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 25vw 25vw;
    position: relative;
    width: 100%;
  }
  &__left {
    display: flex;
  }
  &__artWork {
    margin-right: 4px;
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
    margin-right: 4%;
  }
}
</style>
