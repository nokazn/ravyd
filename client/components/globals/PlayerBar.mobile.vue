<template>
  <v-footer
    app
    padless
    :elevation="12"
    :height="$constant.FOOTER_HEIGHT_MOBILE"
    :color="$constant.FOOTER_BACKGROUND_COLOR"
    :class="$style.PlayerBar"
  >
    <div :class="$style.PlayerBar__container">
      <div :class="$style.Left">
        <ReleaseArtwork
          :src="artWorkSrc(56)"
          :size="56"
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
          v-if="isTrack && hasTrack && !smallerThanSm"
          v-model="isSavedTrack"
          :class="$style.Left__favoriteButton"
        />
      </div>

      <div :class="$style.Right">
        <template v-if="smallerThanSm">
          <FavoriteButton
            v-if="isTrack && hasTrack"
            v-model="isSavedTrack"
          />
          <MediaButton />
        </template>
        <template v-else>
          <ShuffleButton v-if="isTrack" />
          <SkipButton
            v-else
            :seconds="-15"
          />
          <PreviousButton />
          <MediaButton circle />
          <NextButton />
          <RepeatButton v-if="isTrack" />
          <SkipButton
            v-else
            :seconds="15"
          />
        </template>
      </div>
    </div>

    <SeekBar
      hide-text
      thumb-color="transparent"
      :class="$style.Top"
    />

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
import SkipButton from '~/components/containers/player/SkipButton.vue';
import ShuffleButton from '~/components/containers/player/ShuffleButton.vue';
import PreviousButton from '~/components/containers/player/PreviousButton.vue';
import MediaButton from '~/components/containers/player/MediaButton.vue';
import NextButton from '~/components/containers/player/NextButton.vue';
import RepeatButton from '~/components/containers/player/RepeatButton.vue';

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
    SkipButton,
    ShuffleButton,
    PreviousButton,
    MediaButton,
    NextButton,
    RepeatButton,

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
    smallerThanSm(): boolean {
      return this.$window.smallerThan('sm');
    },

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
.PlayerBar {
  z-index: z-index-of(footer) !important;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // .Top の position: absolute を利かせるため
    position: relative;
    width: 100vw;
    height: calc(100% - #{$g-slider-height});
    margin: $g-slider-height 1.5vw 0;
  }
}

.Top {
  position: absolute;
  width: 100vw;
  // フッターの高さの半分分上にして、上部にあるシークバーの幅分下げる
  transform: translateY(calc((#{$g-footer-height-mobile} / -2) + (#{$g-slider-height} / 2)));
}

.Left {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  // flex item の場合は min-width のデフォルト値が auto になる
  // 親要素をはみ出す大きさのときは .Left が縮むようにする
  min-width: 0;

  & > *:not(:last-child) {
    margin-right: 0.5em;
  }

  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-bottom: 0.2em;
    }
  }

  &__favoriteButton {
    margin-right: 0.1em;
  }
}

.Right {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2%;
  // 伸縮しない
  flex: 0 0 200px;

  & > *:not(:last-child) {
    margin-right: min(4vw, 12px);
  }
}

.Overlay {
  z-index: z-index-of(loading);
}
</style>
