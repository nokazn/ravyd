<template>
  <v-card
    hover
    ripple
    :width="width"
    :class="$style.ArtistCard"
    @click="onClick"
  >
    <div :class="$style.ArtistCard__container">
      <UserAvatar
        :src="avatarSrc"
        :alt="name"
        :size="width"
        :icon="mediaIcon"
        :title="name"
        is-overlayed
        @on-media-button-clicked="onMediaButtonClicked"
      />

      <v-card-title
        :class="$style.ArtistCard__title"
      >
        <nuxt-link
          class="g-ellipsis-text"
          :to="artistPath"
          :title="name"
          v-text="name"
        />
      </v-card-title>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import UserAvatar, { MediaIcon } from '~/components/parts/avatar/UserAvatar.vue';
import { App } from '~~/types';

export type ArtistCardInfo = App.ArtistCardInfo

export default Vue.extend({
  components: {
    UserAvatar,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    avatarSrc: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 180,
    },
  },

  computed: {
    artistPath(): string {
      return `/artists/${this.id}`;
    },

    isPlaying(): boolean {
      return this.$state().player.isPlaying;
    },
    isArtistSet(): boolean {
      return this.$getters()['player/isArtistSet'](this.id);
    },

    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isArtistSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  methods: {
    onClick() {
      this.$router.push(this.artistPath);
    },
    onMediaButtonClicked() {
      // 現在再生中のトラック/アルバムの場合
      if (this.isPlaying && this.isArtistSet) {
        this.$dispatch('player/pause');
      } else {
        // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
        this.$dispatch('player/play', this.isArtistSet
          ? undefined
          : { contextUri: this.uri });
      }
    },
  },
});
</script>

<style lang="scss" module>
.ArtistCard {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    display: flex;
    justify-content: center;
    font-size: 0.9rem;
    padding: 16px 8px;
    line-height: 1.2rem;
  }
}
</style>
