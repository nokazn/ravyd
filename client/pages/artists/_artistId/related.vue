<template>
  <div :class="$style.ArtistIdRelatedArtistPage">
    <v-divider :class="$style.ArtistIdRelatedArtistPage__divider" />

    <CardsWrapper
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <ArtistCard
        v-for="artist in relatedArtistList"
        :key="artist.id"
        :item="artist"
        :min-width="$screen.cardWidthMinMax[0]"
        :max-width="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import { App } from '~~/types';

interface Data {}

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
}
</script>

<style lang="scss" module>
.ArtistIdRelatedArtistPage {
  &__divider {
    margin-bottom: 24px;
  }
}
</style>
