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
          :src="artWorkSrc"
          :size="ARTWORK_SIZE"
          :alt="trackName"
          :title="trackName"
          :class="$style.Left__artWork"
        />
        <div
          v-if="hasTrack"
          :class="$style.Left__info"
        >
          <MarqueeTrackName
            :id="trackId"
            :release-id="releaseId"
            :name="trackName"
            :type="trackType"
          />
          <MarqueeArtistNames
            v-if="isTrack"
            :artists="artists"
          />
        </div>

        <FavoriteButton
          v-if="isTrack && hasTrack"
          v-model="isSavedTrack"
          :size="36"
          :class="$style.Left__favorite"
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
          <PlaybackMenu v-model="isSavedTrack" />
        </div>
        <VolumeSlider />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import MarqueeTrackName from '~/components/parts/text/MarqueeTrackName.vue';
import MarqueeArtistNames from '~/components/parts/text/MarqueeArtistNames.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import SeekBar from '~/components/containers/player/SeekBar.vue';
import MediaControllersWrapper from '~/components/parts/wrapper/MediaControllersWrapper.vue';
import TrackQueueMenu from '~/components/containers/player/TrackQueueMenu.vue';
import DeviceSelectMenu from '~/components/containers/player/DeviceSelectMenu.vue';
import PlaybackMenu, { On as OnPlaybackMenu } from '~/components/containers/menu/PlaybackMenu.vue';
import VolumeSlider from '~/components/containers/player/VolumeSlider.vue';

const ARTWORK_SIZE = 60;

export default defineComponent({
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
    const isSavedTrack = computed<boolean>({
      get() { return root.$state().playback.isSavedTrack; },
      set(isSaved: OnFavorite['input'] | OnPlaybackMenu['input']) {
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
      isSavedTrack,
      ARTWORK_SIZE,
    };
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
    margin-right: 0.2em;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;

    & > *:not(:last-child) {
      margin-bottom: 0.375em;
    }
  }
}

.Center {
  position: absolute;
  top: 45%;
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
</style>
