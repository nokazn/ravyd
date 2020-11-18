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
          :src="artWorkSrc"
          :size="ARTWORK_SIZE"
          :alt="trackName"
          :title="trackName"
          :class="$style.Left__artWork"
        />
        <div :class="$style.Left__info">
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
          v-if="isTrack && hasTrack && !$screen.isSp"
          v-model="isSavedTrack"
          :class="$style.Left__favorite"
        />
      </div>

      <div :class="$style.Right">
        <template v-if="$screen.isSp">
          <FavoriteButton
            v-if="isTrack && hasTrack"
            v-model="isSavedTrack"
            :ratio="0.85"
          />
          <MediaButton
            key="sm"
            :ratio="0.85"
          />
        </template>
        <template v-else>
          <SkipButton
            v-if="isEpisode"
            :seconds="-15"
          />
          <ShuffleButton v-else />
          <PreviousButton />
          <MediaButton
            key="md"
            circle
            :size="38"
          />
          <NextButton />
          <SkipButton
            v-if="isEpisode"
            :seconds="15"
          />
          <RepeatButton v-else />
        </template>
      </div>
    </div>

    <ProgressBar :class="$style.Top" />
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import MarqueeTrackName from '~/components/parts/text/MarqueeTrackName.vue';
import MarqueeArtistNames from '~/components/parts/text/MarqueeArtistNames.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ProgressBar from '~/components/containers/player/ProgressBar.vue';
import SkipButton from '~/components/containers/player/SkipButton.vue';
import ShuffleButton from '~/components/containers/player/ShuffleButton.vue';
import PreviousButton from '~/components/containers/player/PreviousButton.vue';
import MediaButton from '~/components/containers/player/MediaButton.vue';
import NextButton from '~/components/containers/player/NextButton.vue';
import RepeatButton from '~/components/containers/player/RepeatButton.vue';

const ARTWORK_SIZE = 48;

export default defineComponent({
  components: {
    ReleaseArtwork,
    MarqueeTrackName,
    MarqueeArtistNames,
    FavoriteButton,
    ProgressBar,
    SkipButton,
    ShuffleButton,
    PreviousButton,
    MediaButton,
    NextButton,
    RepeatButton,
  },

  setup(_, { root }) {
    const deviceSelectMenu = ref(false);

    const artWorkSrc = computed(() => root.$getters()['playback/artworkSrc'](ARTWORK_SIZE));
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
      ARTWORK_SIZE,
    };
  },
});
</script>

<style lang="scss" module>
.PlayerBar {
  z-index: z-index-of(footer) !important;

  &__container {
    @include smaller-than-sm() {
      // 36px * 2 + 12px
      grid-template-columns: auto 84px;
    }

    @include larger-than-sm() {
      // 32px * 2 + 36px * 3 + 12px
      grid-template-columns: auto 184px;
    }

    display: grid;
    justify-content: space-between;
    align-items: center;
    // .Top の position: absolute を利かせるため
    position: relative;
    width: 100vw;
    height: 100%;
    margin: 0 1.5vw;
  }
}

.Top {
  position: absolute;
  width: 100vw;
  transform: translateY(calc(#{$g-footer-height-mobile} / -2));
}

.Left {
  display: flex;
  align-items: center;
  // flex/grid の場合は min-width のデフォルト値が auto になる
  // 親要素をはみ出す大きさのときは .Left が縮むようにする
  min-width: 0;

  & > *:not(:last-child) {
    margin-right: 0.2em;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-bottom: 0.2em;
    }
  }
}

.Right {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 0.2em;
  }
}
</style>
