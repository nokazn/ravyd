<template>
  <div
    v-if="episode != null"
    :class="$style.EpisodeIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="episode != null"
        :class="$style.Fab"
      >
        <ContextMediaButton
          :fab="!$screen.isSp"
          :disabled="!episode.isPlayable"
          :value="isEpisodeSet && isPlaying"
          @input="onContextMediaButtonClicked"
        />
        <EpisodeMenu
          left
          offset-y
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :episode="episode"
          :publisher="episode.showName"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.EpisodeIdPage__header"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :size="$screen.artworkSize"
        :alt="episode.name"
        :title="episode.name"
        shadow
      />

      <div :class="$style.Info">
        <div>
          <span class="g-small-text">
            エピソード
          </span>
          <ExplicitChip
            v-if="episode.explicit"
            :class="$style.Info__explicitIcon"
          />
        </div>

        <h1 :class="$style.Info__title">
          {{ episode.name }}
        </h1>

        <nuxt-link :to="showPath">
          {{ episode.showName }}
        </nuxt-link>

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :disabled="!episode.isPlayable"
              :value="isEpisodeSet && isPlaying"
              @input="onContextMediaButtonClicked"
            />
            <EpisodeMenu
              offset-y
              outlined
              :left="$screen.isSingleColumn"
              :right="$screen.isMultiColumn"
              :episode="episode"
              :publisher="episode.showName"
            />
          </div>

          <EpisodeDetailWrapper
            :episode="episode"
            :class="$style.Info__detail"
          />
        </div>
      </div>
    </div>

    <div :class="$style.EpisodeIdPage__description">
      <h2>
        エピソードの内容
      </h2>
      <p
        v-if="episode.description"
        class="subtext--text"
        v-html="episode.description"
      />
    </div>

    <EpisodeProgressBar
      text
      :resume-point="episode.resumePoint"
      :duration-ms="episode.durationMs"
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

import { elapsedTimeInJapanese } from 'shared/utils';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import EpisodeDetailWrapper from '~/components/parts/wrapper/EpisodeDetailWrapper.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';

import { getEpisode } from '~/services/local/_episodeId';
import { getImageSrc } from '~/services/converter';
import type { App } from '~/entities';

const ARTWORK_SIZE = 220;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  episode: App.EpisodeDetail | undefined
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
    EpisodeDetailWrapper,
    EpisodeProgressBar,
    IntersectionLoadingCircle,
    Copyrights,
    Fallback,
  },

  validate({ params }) {
    return params.episodeId != null && params.episodeId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const episode = await getEpisode(context);
    return { episode };
  },
})
export default class EpisodeIdPage extends Vue implements AsyncData, Data {
  episode: App.EpisodeDetail | undefined = undefined;

  ARTWORK_SIZE = ARTWORK_SIZE;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.episode?.name ?? 'エラー',
    };
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.episode?.images, ARTWORK_SIZE);
  }
  get showPath(): string | undefined {
    return this.episode != null
      ? `/shows/${this.episode?.showId}`
      : undefined;
  }
  get isEpisodeSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.episode?.uri);
  }
  get isPlaying(): boolean {
    return this.$getters()['playback/isPlaying'];
  }
  get remainingTime(): string | undefined {
    if (this.episode == null) return undefined;

    const positionMs = this.episode.resumePoint.resume_position_ms;
    const remainingMs = this.episode.durationMs - positionMs;
    return positionMs > 0
      ? `残り${elapsedTimeInJapanese(remainingMs)}`
      : '未再生';
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.episode != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.episode?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }
  }

  beforeDestroy() {
    this.$header.disconnectObserver();
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    if (this.episode == null) return;
    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isEpisodeSet
        ? undefined
        : { context: this.episode.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }
}
</script>

<style lang="scss" module>
.Fab {
  @include global-fab();
}

.EpisodeIdPage {
  $margin-bottom: 32px;

  @include page-margin();
  @include page-padding();

  &__header {
    margin-bottom: $margin-bottom;

    @include page-header();
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
  @include page-info();

  &__explicitIcon {
    margin-bottom: 0.1rem;
  }

  &__title {
    @include page-title();
  }

  &__footer {
    margin-top: 16px;
    display: flex;

    @include smaller-than-md() {
      flex-direction: column;
    }

    @include larger-than-md() {
      flex-wrap: wrap;
      align-items: flex-end;
    }
  }

  &__buttons {
    @include page-header-buttons(true);
  }

  &__detail {
    // 2行になったとき
    margin-top: 12px;
  }
}
</style>
