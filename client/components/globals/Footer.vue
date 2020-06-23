<template>
  <v-footer
    app
    padless
    :height="80"
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
          <MarqueeReleaseName
            v-if="hasTrack"
            :name="trackName"
            :release-id="releaseId"
          />

          <MarqueeArtistNames
            v-if="hasTrack"
            :artist-list="artistList"
          />
        </div>

        <div :class="$style.Footer__favoriteButton">
          <FavoriteButton
            v-if="hasTrack"
            :is-favorited="isSavedTrack"
            :size="20"
            @on-clicked="onFavoriteButtonClicked"
          />
        </div>
      </div>

      <div :class="$style.Footer__center">
        <seek-bar
          :class="$style.Footer__seekBar"
        />

        <MediaControllersWrapper />
      </div>

      <div :class="$style.Footer__right">
        <div>
          <DeviceSelectMenuButton />

          <v-btn
            ref=""
            icon
            title="メニュー"
          >
            <v-icon :size="20">
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </div>

        <VolumeSlider
          @on-changed="onVolumuChanged"
        />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import MarqueeReleaseName from '~/components/parts/text/MarqueeReleaseName.vue';
import MarqueeArtistNames from '~/components/parts/text/MarqueeArtistNames.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import SeekBar from '~/components/containers/player/SeekBar.vue';
import MediaControllersWrapper from '~/components/parts/wrapper/MediaControllersWrapper.vue';
import DeviceSelectMenuButton from '~/components/containers/player/DeviceSelectMenuButton.vue';
import VolumeSlider, { On as OnVolume } from '~/components/containers/player/VolumeSlider.vue';
import { FOOTER_BACKGROUND_COLOR } from '~/variables';

type Data = {
  FOOTER_BACKGROUND_COLOR: typeof FOOTER_BACKGROUND_COLOR
  deviceSelectMenu: boolean
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    MarqueeReleaseName,
    MarqueeArtistNames,
    FavoriteButton,
    SeekBar,
    MediaControllersWrapper,
    DeviceSelectMenuButton,
    VolumeSlider,
  },

  data(): Data {
    return {
      FOOTER_BACKGROUND_COLOR,
      deviceSelectMenu: false,
    };
  },

  computed: {
    hasTrack(): RootGetters['player/hasTrack'] {
      return this.$getters()['player/hasTrack'];
    },
    artWorkSrc(): (size: number) => string | undefined {
      return (size: number) => this.$getters()['player/artworkSrc'](size);
    },
    trackName(): string {
      return this.$state().player.trackName ?? '';
    },
    trackId(): RootState['player']['trackId'] {
      return this.$state().player.trackId;
    },
    releaseId(): RootGetters['player/releaseId'] {
      return this.$getters()['player/releaseId'];
    },
    artistList(): RootState['player']['artistList'] {
      return this.$state().player.artistList;
    },
    isSavedTrack(): RootState['player']['isSavedTrack'] {
      return this.$state().player.isSavedTrack;
    },
  },

  // player を初期化してからアクティブなデバイスを取得する
  async mounted() {
    await this.$dispatch('player/initPlayer');
    this.$dispatch('player/getActiveDeviceList');
  },

  methods: {
    onFavoriteButtonClicked(isSaved: OnFavorite['on-clicked']) {
      if (this.trackId == null) return;

      // API との通信の結果を待たずに先に表示を変更させておく
      this.$commit('player/SET_IS_SAVED_TRACK', isSaved);
      if (isSaved) {
        this.$dispatch('library/tracks/saveTracks', [this.trackId])
          .catch((err: Error) => {
            console.error({ err });
            this.$toast.show('error', err.message);
          });
      } else {
        this.$dispatch('library/tracks/removeTracks', [this.trackId])
          .catch((err: Error) => {
            console.error({ err });
            this.$toast.show('error', err.message);
          });
      }
    },
    onVolumuChanged(volumePercent: OnVolume['on-changed']) {
      this.$dispatch('player/volume', { volumePercent });
    },
  },
});
</script>

<style lang="scss" module>
.Footer {
  z-index: z-index-of(footer);

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
    margin-left: 4%;

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
