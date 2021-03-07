<template>
  <div
    v-if="feature != null && feature.items.length > 0"
    :class="$style.BrowseFeaturePage"
  >
    <h2 :class="$style.BrowseFeaturePage__title">
      {{ feature.message }}
    </h2>

    <CardsWrapper
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="palylist in feature.items"
        :key="palylist.id"
        :item="palylist"
        :min-size="$screen.cardWidthMinMax[0]"
        :max-size="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>

    <IntersectionLoadingCircle
      :loading="feature.hasNext"
      @appear="onLoadingCircleAppeared"
    />
  </div>

  <Fallback
    v-else
    padless
  >
    プレイリストの情報が取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';
import { getFeaturedPlaylists, Feature } from '~/services/local/browse';

const LIMIT_OF_PLAYLISTS = 50;

interface AsyncData {
  feature: Feature | undefined;
}

@Component({
  components: {
    CardsWrapper,
    PlaylistCard,
    IntersectionLoadingCircle,
    Fallback,
  },

  async asyncData(context): Promise<AsyncData> {
    const feature = await getFeaturedPlaylists(context);
    return { feature };
  },
})
export default class BrowseFeaturePage extends Vue implements AsyncData {
  feature: Feature | undefined = undefined;

  async getFeaturedPlaylists() {
    if (this.feature == null || !this.feature.hasNext) return;

    const currentFeature = this.feature;
    const offset = this.feature.items.length;
    const { playlists, message } = await this.$spotify.browse.getFeaturedPlaylists({
      limit: LIMIT_OF_PLAYLISTS,
      offset,
    });
    if (playlists == null) {
      this.feature = {
        ...currentFeature,
        message,
        hasNext: false,
      };
      return;
    }

    this.feature = {
      ...currentFeature,
      message,
      items: [...currentFeature.items, ...playlists.items],
      hasNext: playlists.next != null,
    };
  }

  onLoadingCircleAppeared() {
    this.getFeaturedPlaylists();
  }
}
</script>

<style lang="scss" module>
.BrowseFeaturePage {
  &__title {
    font-size: 1.5em;
    margin-left: 2%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
