<template>
  <v-menu
    offset-x
    left
    :z-index="Z_INDEX"
    :nudge-left="1"
    open-on-hover
  >
    <template #activator="{ on }">
      <v-list-item
        dense
        v-on="on"
        @click.stop
      >
        <v-list-item-title>
          シェア
        </v-list-item-title>

        <v-list-item-action>
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>

    <v-list
      dense
      :color="MENU_BACKGROUND_COLOR"
      :elevation="12"
    >
      <v-list-item-group>
        <template v-for="item in menuItemList">
          <a
            v-if="item.to != null"
            :key="item.name"
            :href="item.to"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-img
                  :src="item.iconSrc"
                  :alt="item.name"
                  :width="24"
                  :height="24"
                  :aspect-ratio="1"
                />
              </v-list-item-icon>

              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </a>

          <v-list-item
            v-else
            :key="item.name"
            :disabled="item.disabled"
            :inactive="item.disabled"
            @click="item.handler"
          >
            <v-list-item-icon v-if="item.icon != null">
              <v-icon small>
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { createUrl } from '~~/utils/createUrl';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { App, SpotifyAPI } from '~~/types';
import { Toast } from '~/plugins/toast';

type MenuItem = {
  name: string
  to: string
  iconSrc: string
} | {
  name: string
  handler: () => void
  icon?: string
  disabled?: boolean
}

export type Props = {
  name: string
  uri: string
  artistList?: App.SimpleArtistInfo[]
  externalUrls: SpotifyAPI.ExternalUrls
}

type Data = {
  text: string
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

const copyText = (text: string, name: string, $toast: Toast): void => {
  const copyEventListener = (e: ClipboardEvent) => {
    if (e.clipboardData == null) {
      $toast.show('error', `${name}をコピーできませんでした。`);
      return;
    }

    e.preventDefault();
    e.clipboardData.setData('text/plain', text);
    document.removeEventListener('copy', copyEventListener);

    $toast.show('primary', `${name}をコピーしました。`);
  };

  document.addEventListener('copy', copyEventListener);
  document.execCommand('copy');
};

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[] | undefined>,
      default: undefined,
    },
    externalUrls: {
      type: Object as PropType<SpotifyAPI.ExternalUrls>,
      required: true,
    },
  },

  data(): Data {
    const artistNames = this.artistList
      ?.map((artist) => artist.name)
      .join(', ');
    const text = artistNames != null
      ? `${artistNames} の ${this.name}`
      : this.name;

    return {
      text,
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    menuItemList(): MenuItem[] {
      const url = `${process.env.BASE_URL}${this.$route.fullPath}`;

      const twitter = {
        name: 'Twitter',
        to: createUrl('https://twitter.com/share', {
          text: this.text,
          url,
        }),
        iconSrc: '/icon/twitter.png',
      };

      const facebook = {
        name: 'Facebook',
        to: createUrl('https://www.facebook.com/sharer/sharer.php', {
          u: url,
        }),
        iconSrc: '/icon/facebook.png',
      };

      const text = `${this.text} ${url}`;
      const line = {
        name: 'LINE',
        to: `https://line.me/R/msg/text/?${encodeURIComponent(text)}`,
        iconSrc: '/icon/line.png',
      };

      const copyTrackUrl = {
        name: '曲のリンクをコピー',
        handler: () => {
          if (this.externalUrls.spotify != null) {
            copyText(this.externalUrls.spotify, '曲のリンク', this.$toast);
          }
        },
        disabled: this.externalUrls.spotify == null,
      };

      const copyUri = {
        name: 'Spotify URI をコピー',
        handler: () => {
          copyText(this.uri, 'Spotify URI ', this.$toast);
        },
      };

      return [
        twitter,
        facebook,
        line,
        copyTrackUrl,
        copyUri,
      ];
    },
  },
});
</script>
