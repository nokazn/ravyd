<template>
  <v-card
    hover
    ripple
    tile
    width="160"
    :class="$style.ReleaseCard">
    <div :class="$style.ReleaseCard__container">
      <v-hover #default="{ hover }">
        <v-img
          :src="src"
          :alt="alt"
          :height="height"
          :width="width"
          :aspect-ratio="1">
          <v-overlay
            v-if="hover"
            absolute
            :opacity="0.7">
            <v-hover #default="{ hover: buttonHoverd }">
              <v-icon
                :size="playButtonSize(buttonHoverd)">
                mdi-play-circle
              </v-icon>
            </v-hover>
          </v-overlay>
        </v-img>
      </v-hover>

      <v-card-title :class="$style.ReleaseCard__title">
        <nuxt-link :to="releasePath">
          {{ releaseName }}
        </nuxt-link>
      </v-card-title>

      <v-card-subtitle :class="$style.ReleaseCard__subtitle">
        <template
          v-for="({ name, id }, index) in artists">
          <nuxt-link
            :key="id"
            :to="artistPath(id)">
            {{ name }}
          </nuxt-link>

          <span
            v-if="index !== artists.length - 1"
            :key="`${id}-comma`">, </span>
        </template>
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { hasProp } from '@/utils/hasProp';

export type ReleaseCardInfo = {
  releaseName: string
  releaseId: string
  artists: {
    name: string
    id: string
  }[]
  src: string
}

export default Vue.extend({
  // @todo props の型定義
  props: {
    releaseName: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
    artists: {
      type: Array as PropType<ReleaseCardInfo['artists']>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    src: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 160,
    },
    width: {
      type: Number,
      default: 160,
    },
  },

  computed: {
    alt(): string {
      return `${this.releaseName} - ${this.artistsName}`;
    },
    playButtonSize(): (hover: boolean) => number {
      return (hover: boolean) => (hover
        ? 60
        : 48);
    },
    releasePath(): string {
      // @todo
      return `/releases/${this.releaseId}`;
    },
    artistsName(): string {
      return this.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    artistPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseCard {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-size: 0.78rem;
    padding: 12px 8px;
    line-height: 1rem;
  }
  &__subtitle {
    font-size: 0.7rem;
    padding: 8px;
    line-height: 1rem;
    margin-top: -8px!important;
  }
}
</style>
