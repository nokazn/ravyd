<template>
  <v-app dark>
    <v-app-bar
      v-if="isLoggedin"
      app
      :height="48">
      <div :class="$style.Header">
        <search-field
          v-model="searchWords"
          :class="$style.Header__searchField" />

        <user-menu />
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isLoggedin"
      app
      color="#080808"
      permanent
      :mobile-break-point="768"
      expand-on-hover>
      <v-list nav>
        <v-list-item
          v-for="item in navigationDrawerItemList"
          :key="item.title"
          link
          nuxt
          :to="item.to"
          dense>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content app>
      <nuxt />
    </v-content>

    <v-footer
      v-if="isLoggedin"
      fixed
      app
      padless
      :height="80"
      :class="$style.Footer">
      <div :class="$style.Footer__container">
        <div
          v-if="currentTrack != null"
          :class="$style.Footer__left">
          <release-art-work
            v-if="artWorkSrc"
            :src="artWorkSrc"
            alt="current-track-art-work"
            :size="80"
            :class="$style.Footer__artWork" />

          <div :class="$style.Footer__trackInfo">
            <release-name
              v-bind="releases" />

            <artist-name
              :artist-list="artistList" />
          </div>
        </div>

        <div :class="$style.Footer__center">
          <v-slider
            dense
            hide-details
            :class="[$style.Footer__seekBar]" />

          <div :class="$style.Footer__trackControler">
            <v-btn
              icon
              color="grey lighten-1">
              <v-icon :size="16">
                mdi-shuffle-variant
              </v-icon>
            </v-btn>

            <v-btn
              icon
              large>
              <v-icon :size="28">
                mdi-skip-previous
              </v-icon>
            </v-btn>

            <v-btn
              icon
              large
              @click="onMediaClicked">
              <v-icon :size="40">
                {{ mediaButton }}
              </v-icon>
            </v-btn>

            <v-btn
              icon
              large>
              <v-icon :size="28">
                mdi-skip-next
              </v-icon>
            </v-btn>

            <v-btn
              icon
              color="grey lighten-1">
              <v-icon :size="16">
                mdi-repeat
              </v-icon>
            </v-btn>
          </div>
        </div>

        <div :class="$style.Footer__right">
          <div>
            <v-btn
              icon
              small>
              <v-icon :size="16">
                mdi-playlist-play
              </v-icon>
            </v-btn>

            <v-btn
              icon
              small>
              <v-icon :size="16">
                mdi-devices
              </v-icon>
            </v-btn>

            <v-btn
              icon
              small>
              <v-icon :size="16">
                mdi-dots-horizontal
              </v-icon>
            </v-btn>
          </div>

          <div :class="$style.Footer__volumeSlider">
            <v-icon small>
              {{ volumeIcon }}
            </v-icon>

            <v-slider
              v-model="volume"
              hide-details
              dense />
          </div>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';
import SearchField from '@/components/parts/form/SearchField.vue';
import UserMenu from '@/components/parts/menu/UserMenu.vue';
import ReleaseArtWork from '@/components/parts/avatar/ReleaseArtWork.vue';
import ReleaseName, { Releases } from '@/components/parts/text/ReleaseName.vue';
import ArtistName, { Artists } from '@/components/parts/text/ArtistName.vue';

export type Data = {
  searchWords: string
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[],
  isPlaying: boolean;
  volumeIconList: [
    'mdi-volume-mute',
    'mdi-volume-low',
    'mdi-volume-medium',
    'mdi-volume-high',
  ],
  volume: number
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
    ReleaseArtWork,
    ReleaseName,
    ArtistName,
  },

  data(): Data {
    return {
      searchWords: '',
      navigationDrawerItemList: [
        {
          title: 'ホーム',
          to: '/',
          icon: 'mdi-home',
        },
        {
          title: 'ライブラリ',
          to: '/library',
          icon: 'mdi-bookshelf',
        },
      ],
      isPlaying: false,
      volumeIconList: [
        'mdi-volume-mute',
        'mdi-volume-low',
        'mdi-volume-medium',
        'mdi-volume-high',
      ],
      volume: 0,
    };
  },

  computed: {
    isLoggedin(): boolean | null {
      return this.$getters()['auth/isLoggedin'];
    },
    currentTrack(): RootGetters['player/currentTrack'] {
      return this.$getters()['player/currentTrack'];
    },
    artWorkSrc(): NonNullable<RootGetters['player/currentTrack']>['artWorkSrc'] | null {
      return this.currentTrack?.artWorkSrc ?? null;
    },
    releases(): Releases | null {
      return this.currentTrack != null
        ? {
          name: this.currentTrack.trackName,
          releaseId: this.currentTrack.trackId,
        }
        : null;
    },
    artistList(): Artists | null {
      return this.currentTrack?.artists ?? null;
    },
    mediaButton(): 'mdi-play-circle' | 'mdi-pause-circle' {
      return this.isPlaying
        ? 'mdi-play-circle'
        : 'mdi-pause-circle';
    },
    volumeIcon(): Data['volumeIconList'][keyof Data['volumeIconList']] {
      const index = Math.min(
        Math.floor((this.volume / 100) * this.volumeIconList.length),
        this.volumeIconList.length - 1,
      );
      return this.volumeIconList[index];
    },
  },

  methods: {
    onMediaClicked() {
      this.isPlaying = !this.isPlaying;
    },
  },
});
</script>

<style lang="scss" module>
.Header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 8px;
  &__searchField {
    width: 20%;
  }
}

.Footer {
  position: relative;
  &__container {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
  }
  &__left {
    display: flex;
  }
  &__artWork {
    margin-right: 4px;
  }
  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__seekBar {
    width: 50vw;
  }
  &__trackControler {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -8px;
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 2%;
  }
  &__volumeSlider {
    display: flex;
    justify-content: center;
    min-width: 120px;
    & > *:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>

<style lang="scss">
/**
 * スライダーのスタイルを上書き
 */
.v-slider__thumb {
  cursor: pointer;
}
</style>
