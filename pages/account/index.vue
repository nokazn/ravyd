<template>
  <main class="account-page">
    <h1>アカウント</h1>
    <v-card class="account-card">
      <v-list>
        <template
          v-for="(item, index) in itemList">
          <v-list-item
            :key="item.title">
            <v-list-item-content>
              <v-list-item-title class="account-card__content">
                <div>
                  {{ item.title }}
                </div>
                <div>
                  {{ item.value }}
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider
            v-show="itemList.length !== index + 1"
            :key="index" />
        </template>
      </v-list>
    </v-card>

    <v-btn
      rounded
      color="green lighten-2"
      nuxt
      to="//www.spotify.com/jp/account/overview/"
      target="_blank">
      アカウント情報を編集
    </v-btn>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { AuthState } from '@/store/auth/state';

export type ItemList = {
  title: string
  value?: string | null
}[]

export default Vue.extend({
  name: 'AccountPage',

  computed: {
    ...mapState('auth', [
      'userData',
    ]),
    itemList(): ItemList | null {
      const userData = this.userData as AuthState['userData'];
      return userData != null
        ? [
          {
            title: 'ユーザー名',
            value: userData.display_name,
          },
          {
            title: 'メールアドレス',
            value: userData.email,
          },
          {
            title: '国',
            value: userData.country,
          },
        ]
        : null;
    },
  },
});
</script>

<style lang="scss" scoped>
.account-page {
  min-width: 300px;
  margin: 24px 6%;
  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
  .account-card__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    & > *:first-child {
      font-size: 0.9em;
      color: #bdbdbd;
    }
  }
}
</style>
