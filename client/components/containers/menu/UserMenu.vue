<template>
  <v-menu
    v-model="isOpened"
    offset-y
    :nudge-bottom="2"
  >
    <template
      #activator="{ on }"
    >
      <div
        :title="userDisplayName"
        :class="$style.UserMenu"
        v-on="on"
      >
        <div
          :class="$style.UserMenu__container"
        >
          <UserAvatar
            :src="userAvatarSrc"
            :alt="userDisplayName"
            :size="32"
          />

          <span
            :class="$style.UserMenu__userDisplayName"
          >
            @{{ userDisplayName }}
          </span>

          <v-icon
            x-small
          >
            mdi-chevron-down
          </v-icon>
        </div>
      </div>
    </template>

    <v-list
      dense
      :elevation="12"
      :color="MENU_BACKGROUND_COLOR"
    >
      <template
        v-for="(itemList, index) in itemLists"
      >
        <v-list-item
          v-for="item in itemList"
          :key="item.title"
          nuxt
          link
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-show="itemLists.length !== index + 1"
          :key="index"
        />
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import { MENU_BACKGROUND_COLOR } from '~/variables';

type Data = {
  isOpened: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
  itemLists: {
    title: string
    to: string
  }[][]
};

export default Vue.extend({
  components: {
    UserAvatar,
  },

  data(): Data {
    return {
      isOpened: false,
      MENU_BACKGROUND_COLOR,
      itemLists: [
        [
          {
            title: 'アカウント',
            to: '/account',
          },
        ], [
          {
            title: 'ログアウト',
            to: '/logout',
          },
        ],
      ],
    };
  },

  computed: {
    isLoggedin(): RootGetters['auth/isLoggedin'] {
      return this.$getters()['auth/isLoggedin'];
    },
    userAvatarSrc(): RootGetters['auth/userAvatarSrc'] {
      return this.$getters()['auth/userAvatarSrc'];
    },
    userDisplayName(): RootGetters['auth/userDisplayName'] {
      return this.$getters()['auth/userDisplayName'];
    },
  },
});
</script>

<style lang="scss" module>
.UserMenu {
  &__container {
    cursor: pointer;
    display: flex;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 8px;
    }

    .UserMenu__userDisplayName {
      font-size: 1.1em;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

</style>
