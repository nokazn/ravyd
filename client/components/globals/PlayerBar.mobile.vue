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
          <SkipButton
            v-if="isEpisode"
            :seconds="-15"
          />
          <ShuffleButton v-else />
          <PreviousButton />
          <MediaButton circle />
          <NextButton />
          <SkipButton
            v-if="isEpisode"
            :seconds="15"
          />
          <RepeatButton v-else />
        </template>
      </div>
    </div>

    <SeekBar
      hide-text
      thumb-color="transparent"
      :class="$style.Top"
    />
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
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

export default defineComponent({
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

  setup(_, { root }) {
    const deviceSelectMenu = ref(false);

    const smallerThanSm = computed(() => root.$screen.smallerThan('sm'));
    const artWorkSrc = (size: number) => root.$getters()['playback/artworkSrc'](size);
    const trackName = computed(() => root.$state().playback.trackName || '不明のトラック');
    const trackId = computed(() => root.$state().playback.trackId);
    const trackType = computed(() => root.$state().playback.trackType);
    const releaseId = computed(() => root.$getters()['playback/releaseId']);
    const artists = computed(() => root.$state().playback.artists);
    const isAnotherDevicePlaying = computed(() => root.$getters()['playback/isAnotherDevicePlaying']);
    const hasTrack = computed(() => root.$getters()['playback/hasTrack']);
    const isTrack = computed(() => trackType.value === 'track');
    const isEpisode = computed(() => trackType.value === 'episode');
    const isSavedTrack = computed<boolean>({
      get() { return root.$state().playback.isSavedTrack; },
      set(isSaved: OnFavorite['input']) {
        const id = trackId.value;
        if (id == null) return;
        // API との通信の結果を待たずに先に表示を変更させておく
        root.$commit('playback/SET_IS_SAVED_TRACK', isSaved);
        if (isSaved) {
          root.$dispatch('library/tracks/saveTracks', [id]);
        } else {
          root.$dispatch('library/tracks/removeTracks', [id]);
        }
      },
    });

    return {
      deviceSelectMenu,
      smallerThanSm,
      artWorkSrc,
      trackName,
      trackId,
      trackType,
      releaseId,
      artists,
      isAnotherDevicePlaying,
      hasTrack,
      isTrack,
      isEpisode,
      isSavedTrack,
    };
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
  margin-right: min(4vw, 12px);

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

  @include smaller-than-md() {
    // 伸縮させない
    // 36px * 2 + 12px
    flex: 0 0 84px;
  }

  @include larger-than-md() {
    // 伸縮させない
    // 36px * 5 + 12px
    flex: 0 0 192px;
  }

  & > *:not(:last-child) {
    margin-right: min(4vw, 12px);
  }
}

.Overlay {
  z-index: z-index-of(loading);
}
</style>
