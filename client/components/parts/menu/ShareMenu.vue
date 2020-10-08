<template>
  <OptionMenu
    offset-x
    :left="left"
    :right="right"
    :nudge-left="1"
    open-on-hover
  >
    <template #activator="{ on }">
      <ChildOptionMenuActivator :on="on">
        シェア
      </ChildOptionMenuActivator>
    </template>

    <v-list-item-group>
      <template v-for="item in menuItemList">
        <a
          v-if="item.type === 'to'"
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
  </OptionMenu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
import { createUrl } from '~~/utils/createUrl';
import type { $Toast } from '~/plugins/observable/toast';
import type { App, SpotifyAPI } from '~~/types';

type MenuType = 'to' | 'custom'
type MenuItem<T extends MenuType = MenuType> = T extends 'to'
  ? {
    type: T;
    name: string;
    to: string;
    iconSrc: string;
  }
  : {
    type: T;
    name: string;
    handler: () => void;
    icon?: string;
    disabled?: boolean;
  }

export type Props = {
  name: string
  uri: string
  url?: string
  typeName: string
  artists: App.SimpleArtistInfo[] | string | undefined
  externalUrls: SpotifyAPI.ExternalUrls
  left?: boolean
  right?: boolean
}

type Data = {
  text: string;
}

const copyText = (text: string, name: string, $toast: $Toast): void => {
  const copyEventListener = (e: ClipboardEvent) => {
    if (e.clipboardData == null) {
      $toast.push({
        color: 'error',
        message: `${name}をコピーできませんでした。`,
      });
      return;
    }

    e.preventDefault();
    e.clipboardData.setData('text/plain', text);
    document.removeEventListener('copy', copyEventListener);

    $toast.push({
      color: 'primary',
      message: `${name}をコピーしました。`,
    });
  };

  document.addEventListener('copy', copyEventListener);
  document.execCommand('copy');
};

export default Vue.extend({
  components: {
    OptionMenu,
    ChildOptionMenuActivator,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    url: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    typeName: {
      type: String,
      required: true,
    },
    artists: {
      type: [Array, String] as PropType<App.SimpleArtistInfo[] | string | undefined>,
      default: undefined,
    },
    externalUrls: {
      type: Object as PropType<SpotifyAPI.ExternalUrls>,
      required: true,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    const { artists } = this;
    const artistNames: string | undefined = Array.isArray(artists)
      ? artists.map((artist) => artist.name).join(', ')
      : artists;
    const text = artistNames != null
      ? `${artistNames} の ${this.name}`
      : this.name;

    return {
      text,
    };
  },

  computed: {
    menuItemList(): MenuItem[] {
      const path = this.url ?? this.$route.path;
      const url = `${process.env.BASE_URL}${path}`;

      const twitter: MenuItem<'to'> = {
        type: 'to',
        name: 'Twitter',
        to: createUrl('https://twitter.com/share', {
          text: this.text,
          url,
        }),
        iconSrc: '/icon/twitter.png',
      };

      const facebook: MenuItem<'to'> = {
        type: 'to',
        name: 'Facebook',
        to: createUrl('https://www.facebook.com/sharer/sharer.php', {
          u: url,
        }),
        iconSrc: '/icon/facebook.png',
      };

      const text = `${this.text} ${url}`;
      const line: MenuItem<'to'> = {
        type: 'to',
        name: 'LINE',
        to: `https://line.me/R/msg/text/?${encodeURIComponent(text)}`,
        iconSrc: '/icon/line.png',
      };

      const copyTrackUrl: MenuItem<'custom'> = {
        type: 'custom',
        name: `${this.typeName}のリンクをコピー`,
        handler: () => {
          if (this.externalUrls.spotify != null) {
            copyText(this.externalUrls.spotify, `${this.typeName}のリンク`, this.$toast);
          }
        },
        disabled: this.externalUrls.spotify == null,
      };

      const copyUri: MenuItem<'custom'> = {
        type: 'custom',
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
