<template>
  <div :class="$style.AccountPage">
    <h1>アカウント</h1>

    <TwoColumnsListCard
      v-if="itemList"
      :item-list="itemList"
    />
    <v-skeleton-loader
      v-else
      type="list-item"
    />

    <v-btn
      rounded
      color="cyan darken-3"
      nuxt
      to="//www.spotify.com/jp/account/overview/"
      target="_blank"
    >
      <span>
        アカウント情報を編集
      </span>
      <v-icon
        small
        :class="$style.AccountPage__editAccountIcon"
      >
        mdi-open-in-new
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TwoColumnsListCard, { ItemList } from '~/components/parts/list/TwoColumnsListCard.vue';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  components: {
    TwoColumnsListCard,
  },

  computed: {
    userData(): SpotifyAPI.UserData | null {
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

  head() {
    return {
      title: 'アカウント',
    };
  },
});
</script>

<style lang="scss" module>
.AccountPage {
  min-width: 300px;
  margin: 24px 6%;
  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
  &__editAccountIcon {
    margin-left: 8px;
  }
}
</style>
