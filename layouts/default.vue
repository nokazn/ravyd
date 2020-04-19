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
      permanent
      :mobile-break-point="768"
      expand-on-hover>
      <v-list
        nav>
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
      <v-slider
        dense
        hide-details
        :class="[$style.Footer__seekBar, 'g-track-seek-bar']" />

      <div
        v-if="currentTrack != null"
        :class="$style.Footer__container">
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

type Data = {
  searchWords: string
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[]
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
});
</script>

<style lang="scss" module>
.Header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  &__searchField {
    width: 20%;
  }
}

.Footer {
  position: relative;
  &__seekBar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    margin: 0;
    transform: translateY(-50%);
  }
  &__container {
    display: flex;
    & > *:not(:last-child) {
      margin-right: 4px;
    }
  }
  &__artWork {
    height: 80px;
    width: 80px;
  }
  &__trackInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<style lang="scss">
/**
 * フッターのシークバーのスタイルを上書き
 */
.g-track-seek-bar {
  .v-slider--horizontal {
    margin: 0;
    min-height: 0;
  }
  .v-slider__thumb {
    cursor: pointer;
  }
}
</style>
