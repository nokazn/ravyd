<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="card"
      boilerplate
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
    />
    <v-card
      v-else
      hover
      ripple
      nuxt
      :to="artistPath"
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
      :class="$style.ArtistCard"
    >
      <div :class="$style.ArtistCard__container">
        <div :class="$style.ArtistCard__avatar">
          <UserAvatar
            :src="avatarSrc"
            :alt="name"
            :size="width"
            :icon="mediaIcon"
            default-user-icon="mdi-account-music"
            small-icon
            :title="name"
            is-overlayed
            @on-media-button-clicked="onMediaButtonClicked"
          />
        </div>

        <v-card-title
          :class="$style.ArtistCard__title"
        >
          <span
            class="g-ellipsis-text"
            :title="name"
            v-text="name"
          />
        </v-card-title>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import UserAvatar, { MediaIcon } from '~/components/parts/avatar/UserAvatar.vue';
import { App } from '~~/types';

export type ArtistCardInfo = App.ArtistCardInfo

export type Data = {
  artistPath: string
  isLoaded: boolean
}

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
    maxWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    return {
      artistPath: `/artists/${this.id}`,
      isLoaded: false,
    };
  },

  computed: {
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

  mounted() {
    this.isLoaded = true;
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中のトラック/アルバムの場合
      if (this.isPlaying && this.isArtistSet) {
        this.$dispatch('player/pause');
      } else {
        const params = this.isArtistSet
          ? undefined
          : { contextUri: this.uri };
        // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
        this.$dispatch('player/play', params);
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

  &__avatar {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  &__title {
    display: flex;
    justify-content: center;
    font-size: 0.9rem;
    line-height: 1.2rem;
  }
}
</style>
