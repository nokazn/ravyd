<template>
  <v-menu
    v-model="isOpen"
    offset-y
    :nudge-bottom="2">
    <template
      #activator="{ on }">
      <v-btn
        text
        small
        rounded
        v-on="on">
        <div class="user-menu__button">
          <user-avatar
            :src="userAvatarSrc" />

          <span>
            {{ userDisplayName }}
          </span>

          <v-icon x-small>
            mdi-chevron-down
          </v-icon>
        </div>
      </v-btn>
    </template>

    <v-list
      dense>
      <template
        v-for="(itemList, index) in itemLists">
        <v-list-item
          v-for="item in itemList"
          :key="item.title"
          nuxt
          link
          :to="item.to">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-show="itemLists.length !== index + 1"
          :key="index" />
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import UserAvatar from '@/components/parts/avatar/UserAvatar.vue';

type Data = {
  isOpen: boolean
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
      isOpen: false,
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
    isLoggedin() {
      return this.$getters['auth/isLoggedin'];
    },
    userAvatarSrc() {
      return this.$getters['auth/userAvatarSrc'];
    },
    userDisplayName() {
      return this.$getters['auth/userDisplayName'];
    },
  },
});
</script>

<style lang="scss" scoped>
.user-menu__button {
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 6px;
  }
}
</style>
