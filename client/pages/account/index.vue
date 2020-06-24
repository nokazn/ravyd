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
      color="success"
      nuxt
      to="//www.spotify.com/jp/account/overview/"
      target="_blank"
    >
      <span>
        アカウント情報を編集
      </span>
      <v-icon
        small
        right
      >
        mdi-open-in-new
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

import TwoColumnsListCard, { ItemList } from '~/components/parts/list/TwoColumnsListCard.vue';

export default Vue.extend({
  components: {
    TwoColumnsListCard,
  },

  computed: {
    userData(): RootState['auth']['userData'] {
      return this.$state().auth.userData;
    },
    itemList(): ItemList | undefined {
      if (this.userData == null) return undefined;

      return [
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
      ];
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
}
</style>
