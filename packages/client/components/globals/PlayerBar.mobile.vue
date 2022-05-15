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
          v-if="isTrack && !$screen.isSp"
          v-model="isSaved"
          :class="$style.Left__favorite"
        />
      </div>

      <div :class="$style.Right">
        <template v-if="$screen.isSp">
          <FavoriteButton
            v-if="isTrack"
            v-model="isSaved"
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
          <PreviousButton :size="32" />
          <MediaButton
            key="md"
            circle
          />
          <NextButton :size="32" />
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
import { defineComponent, computed, PropType } from '@vue/composition-api';
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
import type { App } from '~/entities';
import type { ArtworkSrc } from './PlayerBar.vue';

const INPUT = 'input';
const ARTWORK_SIZE = 48;

export type On = {
  [INPUT]: boolean;
};

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
    const isTrack = computed(() => props.track?.type === 'track');
    const isEpisode = computed(() => props.track?.type === 'episode');
    const isSaved = computed<boolean>({
      get() { return props.value; },
      set(saved: OnFavorite['input']) { emit(INPUT, saved); },
    });

    return {
      isTrack,
      isEpisode,
      isSaved,
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

  @include avoid-overflowing();

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
