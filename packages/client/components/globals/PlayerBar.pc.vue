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
          :src="artworkSrc(ARTWORK_SIZE)"
          :size="ARTWORK_SIZE"
          :alt="trackName"
          :title="trackName"
          :class="$style.Left__artwork"
        />
        <div
          v-if="track != null && hasTrack"
          :class="$style.Left__info"
        >
          <MarqueeTrackName
            :id="track.id"
            :name="track.name"
            :type="track.type"
            :release-id="track.album.id"
          />
          <MarqueeArtistNames
            v-if="isTrack"
            :artists="track.artists"
          />
        </div>

        <FavoriteButton
          v-if="isTrack && hasTrack"
          v-model="isSaved"
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
          <PlaybackMenu v-model="isSaved" />
        </div>
        <VolumeSlider />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
} from '@vue/composition-api';
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
import type { App } from '~/entities';
import type { ArtworkSrc } from './PlayerBar.vue';

const INPUT = 'input';
const ARTWORK_SIZE = 60;

export type On = {
  [INPUT]: boolean;
};

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

  props: {
    track: {
      type: Object as PropType<App.ExtendedTrack | undefined>,
      default: undefined,
    },
    artworkSrc: {
      type: Function as PropType<ArtworkSrc>,
      required: true,
    },
    trackName: {
      type: String,
      required: true,
    },
    hasTrack: {
      type: Boolean,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const deviceSelectMenu = ref(false);
    const isTrack = computed(() => props.track?.type === 'track');
    const isEpisode = computed(() => props.track?.type === 'episode');
    const trackType = computed(() => props.track?.type);
    const isSaved = computed<boolean>({
      get() { return props.value; },
      set(saved: OnFavorite['input'] | OnPlaybackMenu['input']) { emit(INPUT, saved); },
    });

    return {
      deviceSelectMenu,
      isTrack,
      isEpisode,
      trackType,
      isSaved,
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
