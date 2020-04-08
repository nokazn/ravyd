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
        <div class="userMenu__button">
          <v-avatar
            v-if="userAvatarSrc"
            class="userMenu__avatar">
            <img
              :src="userAvatarSrc"
              alt="user-avatar">
          </v-avatar>
          <v-icon
            v-else
            dense
            class="userMenu__avatar">
            mdi-account-circle-outline
          </v-icon>

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
      <v-list-item-group>
        <template
          v-for="(itemList, index) in itemLists">
          <v-list-item
            v-for="item in itemList"
            :key="item.title"
            nuxt
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
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { AuthState } from '@/store/auth/state';

type Data = {
  isOpen: boolean
  itemLists: {
    title: string
    to: string
  }[][]
};

export default Vue.extend({
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
            to: '/api/auth/logout',
          },
        ],
      ],
    };
  },

  // @todo
  computed: {
    ...mapState('auth', {
    // @ts-ignore
      userAvatarSrc: (state: AuthState) => state.userData?.images[0]?.url ?? null,
      userDisplayName: (state: AuthState) => state.userData?.display_name ?? state.userData?.email,
    }),
    ...mapGetters('auth', [
      'isLoggedin',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.userMenu__button {
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 6px;
  }
}
</style>
