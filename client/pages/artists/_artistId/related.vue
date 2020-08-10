<template>
  <div :class="$style.ArtistIdRelatedArtistPage">
    <v-divider :class="$style.ArtistIdRelatedArtistPage__divider" />

    <CardsWrapper>
      <ArtistCard
        v-for="artist in relatedArtistList"
        :key="artist.id"
        v-bind="artist"
        :min-width="FLEX_CARD_MIN_WIDTH"
        :max-width="FLEX_CARD_MAX_WIDTH"
      />
    </CardsWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/variables';
import { App } from '~~/types';

interface Data {
  FLEX_CARD_MIN_WIDTH: number
  FLEX_CARD_MAX_WIDTH: number
}

@Component({
  components: {
    CardsWrapper,
    ArtistCard,
  },
})
export default class RelatedArtistPage extends Vue implements Data {
  @Prop([Object])
  artistInfo!: App.ArtistInfo;

  @Prop([Array])
  relatedArtistList!: App.ContentItemInfo<'artist'>[];

  FLEX_CARD_MIN_WIDTH = FLEX_CARD_MIN_WIDTH;
  FLEX_CARD_MAX_WIDTH = FLEX_CARD_MAX_WIDTH;
}
</script>

<style lang="scss" module>
.ArtistIdRelatedArtistPage {
  &__divider {
    margin-bottom: 24px;
  }
}
</style>
