<template>
  <v-menu
    offset-x
    left
    :z-index="1001"
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
          <v-icon>
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
            :key="item.name"
            :href="item.to"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon
                  v-if="item.icon != null"
                  small
                >
                  {{ item.icon }}
                </v-icon>

                <v-img
                  v-else
                  :src="item.iconSrc"
                  :alt="item.name"
                  :width="20"
                  :height="20"
                  :aspect-ratio="1"
                />
              </v-list-item-icon>

              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </a>
        </template>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { MENU_BACKGROUND_COLOR } from '~/variables';
import { App } from '~~/types';
import { createUrl } from '~~/utils/createUrl';

type MenuItem = {
  name: string
  to: string
  icon: string
} | {
  name: string
  to: string
  iconSrc: string
}

type Data = {
  text: string
  MENU_BACKGROUND_COLOR: string
}

export default Vue.extend({
  props: {
    track: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
  },

  data(): Data {
    const artist = this.track.artistList[0] ?? this.track.featuredArtistList[0];
    const text = `${artist.name}の${this.track.name}`;

    return {
      text,
      MENU_BACKGROUND_COLOR,
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

      return [
        twitter,
        facebook,
        line,
      ];
    },
  },
});
</script>
