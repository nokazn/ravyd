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
      <template v-for="item in menuItems">
        <a
          v-if="item.type === 'to'"
          :key="item.name"
          target="_blank"
          rel="nofollow noopener noreferrer"
          :href="item.to"
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
import { defineComponent, computed, PropType } from '@vue/composition-api';

import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
import { useCopyText } from '~/use/util';
import { createUrl } from '~~/utils/createUrl';
import type { App, SpotifyAPI } from '~~/types';

type MenuType = 'to' | 'custom';
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
  };

export type Props = {
  name: string;
  uri: string;
  url?: string;
  typeName: string;
  artists: App.MinimumArtist[] | string | undefined;
  externalUrls: SpotifyAPI.ExternalUrls;
  left?: boolean;
  right?: boolean;
}

export default defineComponent({
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
      type: [Array, String] as PropType<App.MinimumArtist[] | string | undefined>,
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

  setup(props, { root }) {
    const menuItems = computed<MenuItem[]>(() => {
      const artistNames: string | undefined = Array.isArray(props.artists)
        ? props.artists.map((artist) => artist.name).join(', ')
        : props.artists;
      const text = artistNames != null
        ? `${artistNames} の ${props.name}`
        : props.name;

      const path = props.url ?? root.$route.path;
      const url = `${process.env.BASE_URL}${path}`;

      const twitter: MenuItem<'to'> = {
        type: 'to',
        name: 'Twitter',
        to: createUrl('https://twitter.com/share', {
          text,
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

      const line: MenuItem<'to'> = {
        type: 'to',
        name: 'LINE',
        to: `https://line.me/R/msg/text/?${encodeURIComponent(`${text} ${url}`)}`,
        iconSrc: '/icon/line.png',
      };

      const copyTrackUrl: MenuItem<'custom'> = {
        type: 'custom',
        name: `${props.typeName}のリンクをコピー`,
        handler: () => {
          if (props.externalUrls.spotify != null) {
            useCopyText(root, props.externalUrls.spotify, `${props.typeName}のリンク`);
          }
        },
        disabled: props.externalUrls.spotify == null,
      };

      const copyUri: MenuItem<'custom'> = {
        type: 'custom',
        name: 'Spotify URI をコピー',
        handler: () => { useCopyText(root, props.uri, 'Spotify URI '); },
      };

      return [
        twitter,
        facebook,
        line,
        copyTrackUrl,
        copyUri,
      ];
    });

    return { menuItems };
  },
});
</script>
