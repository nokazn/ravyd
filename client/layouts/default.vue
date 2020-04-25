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
            <release-name v-bind="releases" />
            <artist-name :artist-list="artistList" />
          </div>
        </div>

        <div :class="$style.Footer__center">
          <seek-bar :class="$style.Footer__seekBar" />
          <media-controller />
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

          <volume-slider />
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';
import SearchField from '~/components/parts/form/SearchField.vue';
import UserMenu from '~/components/parts/menu/UserMenu.vue';
import ReleaseArtWork from '~/components/parts/avatar/ReleaseArtWork.vue';
import ReleaseName, { Releases } from '~/components/parts/text/ReleaseName.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import SeekBar from '~/components/parts/player/SeekBar.vue';
import MediaController from '~/components/parts/player/MediaController.vue';
import VolumeSlider from '~/components/parts/player/VolumeSlider.vue';

export type Data = {
  searchWords: string
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[],
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
    ReleaseArtWork,
    ReleaseName,
    ArtistName,
    SeekBar,
    MediaController,
    VolumeSlider,
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
  },

  mounted() {
    this.$dispatch('player/initPlayer');
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
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr 1fr;
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
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__seekBar {
    width: 50vw;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 2%;
  }
}
</style>
