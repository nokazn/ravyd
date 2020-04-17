<template>
  <main class="account-page">
    <h1>アカウント</h1>

    <two-columns-list-card
      v-if="itemList"
      :item-list="itemList" />
    <v-skeleton-loader
      v-else
      type="list-item" />

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
import TwoColumnsListCard, { ItemList } from '@/components/parts/list/TwoColumnsListCard.vue';
import { Spotify } from '@/types';

export default Vue.extend({
  components: {
    TwoColumnsListCard,
  },

  computed: {
    userData(): Spotify.Auth.UserData | null {
      return this.$state().auth.userData ?? null;
    },
    itemList(): ItemList | null {
      return this.userData != null
        ? [
          {
            title: 'ユーザー名',
            value: this.userData.display_name,
          },
          {
            title: 'メールアドレス',
            value: this.userData.email,
          },
          {
            title: '国',
            value: this.userData.country,
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
}
</style>
