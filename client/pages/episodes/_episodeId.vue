<template>
  <div
    v-if="episodeInfo != null"
    :class="$style.EpisodeIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="episodeInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <ContextMediaButton
          fab
          :height="32"
          :is-playing="isEpisodeSet && isPlaying"
          :disabled="!episodeInfo.isPlayable"
          @on-clicked="onContextMediaButtonClicked"
        />
        <EpisodeMenu
          outlined
          left
          offset-y
          :size="32"
          :episode="episodeInfo"
          :publisher="episodeInfo.showName"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.EpisodeIdPage__header"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :size="$window.artworkSize"
        :alt="episodeInfo.name"
        :title="episodeInfo.name"
        shadow
      />

      <div :class="$style.Info">
        <div>
          <span class="g-small-text">
            ポッドキャストエピソード
          </span>
          <ExplicitChip
            v-if="episodeInfo.explicit"
            :class="$style.Info__explicitIcon"
          />
        </div>

        <h1 :class="$style.Info__title">
          {{ episodeInfo.name }}
        </h1>

        <nuxt-link :to="showPath">
          {{ episodeInfo.showName }}
        </nuxt-link>

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isEpisodeSet && isPlaying"
              :disabled="!episodeInfo.isPlayable"
              @on-clicked="onContextMediaButtonClicked"
            />
            <EpisodeMenu
              offset-y
              outlined
              :episode="episodeInfo"
              :publisher="episodeInfo.showName"
            />
          </div>

          <div :class="$style.Info__detail">
            <ReleaseDate
              :release-date="episodeInfo.releaseDate"
              :release-date-precision="episodeInfo.releaseDatePrecision"
            />
            <ReleaseDuration
              :duration-ms="episodeInfo.durationMs"
              :is-full="true"
            />
          </div>
        </div>
      </div>
    </div>

    <div :class="$style.EpisodeIdPage__description">
      <h2>
        エピソードの内容
      </h2>
      <p
        v-if="episodeInfo.description"
        class="subtext--text"
        v-html="episodeInfo.description"
      />
    </div>

    <EpisodeProgressBar
      text
      :resume-point="episodeInfo.resumePoint"
      :duration-ms="episodeInfo.durationMs"
      :max-width="300"
      :class="$style.EpisodeIdPage__progress"
    />
  </div>

  <Fallback v-else>
    エピソードの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getEpisodeInfo } from '~/plugins/local/_episodeId';
import { getImageSrc } from '~/utils/image';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  episodeInfo: App.EpisodeDetail | undefined
}

interface Data {
  ARTWORK_SIZE: number
  HEADER_REF: string
}

@Component({
  components: {
    ReleaseArtwork,
    ExplicitChip,
    ContextMediaButton,
    EpisodeMenu,
    ReleaseDate,
    ReleaseDuration,
    EpisodeProgressBar,
    IntersectionLoadingCircle,
    Copyrights,
    Fallback,
  },

  validate({ params }) {
    return params.episodeId != null && params.episodeId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const episodeInfo = await getEpisodeInfo(context);

    return {
      episodeInfo,
    };
  },
})
export default class EpisodeIdPage extends Vue implements AsyncData, Data {
  episodeInfo: App.EpisodeDetail | undefined = undefined;

  ARTWORK_SIZE = ARTWORK_SIZE;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.episodeInfo?.name ?? 'エラー',
    };
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.episodeInfo?.images, ARTWORK_SIZE);
  }
  get showPath(): string | undefined {
    return this.episodeInfo != null
      ? `/shows/${this.episodeInfo?.showId}`
      : undefined;
  }
  get isEpisodeSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.episodeInfo?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get remainingTime(): string | undefined {
    if (this.episodeInfo == null) return undefined;

    const positionMs = this.episodeInfo.resumePoint.resume_position_ms;
    const remainingMs = this.episodeInfo.durationMs - positionMs;
    return positionMs > 0
      ? `残り${elapsedTimeInJapanese(remainingMs)}`
      : '未再生';
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.episodeInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.episodeInfo?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }
  }

  beforeDestroy() {
    this.$header.disconnectObserver();
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.episodeInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isEpisodeSet
        ? undefined
        : { contextUri: this.episodeInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }
}
</script>

<style lang="scss" module>
.AdditionalHeaderContent {
  @include additional-header-content();
}

.EpisodeIdPage {
  $margin-bottom: 32px;

  @include page-margin;
  @include page-padding;

  &__header {
    margin-bottom: $margin-bottom;

    @include page-header;
  }

  &__description {
    margin-bottom: $margin-bottom;

    & > *:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__progress {
    margin-bottom: $margin-bottom;
  }
}

.Info {
  @include page-info;

  &__explicitIcon {
    margin-bottom: 0.1rem;
  }

  &__title {
    @include page-title;
  }

  &__footer {
    margin-top: 16px;
    display: flex;

    @include smaller-than-md {
      flex-direction: column;
    }

    @include larger-than-md {
      flex-wrap: wrap;
      align-items: flex-end;
    }
  }

  &__buttons {
    @include page-header-buttons(true);
  }

  &__detail {
    margin-top: 12px;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
