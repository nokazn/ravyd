<template>
  <page>
    <div :class="$style.LoginPage">
      <v-card
        v-show="!isLoggedin"
        :class="$style.LoginCard">
        <v-icon
          :size="150">
          mdi-account-circle
        </v-icon>

        <v-btn
          rounded
          color="cyan darken-3"
          :class="$style.LoginCard__button"
          @click="onAuthButtonClicked">
          Spotify アカウントで認証
        </v-btn>

        <p :class="$style.LoginCard__signupText">
          アカウントをお持ちでない場合は
          <a
            href="//www.spotify.com/jp/signup/"
            target="_blank">
            新規作成
          </a>
        </p>
      </v-card>
    </div>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';

import Page from '~/components/globals/Page.vue';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  components: {
    Page,
  },

  computed: {
    isLoggedin(): boolean | null {
      return this.$getters()['auth/isLoggedin'];
    },
  },

  methods: {
    async onAuthButtonClicked(): Promise<void> {
      const res: SpotifyAPI.Auth.AuthorizationResponse<'access_token' | 'url'> | null = await this.$axios({
        method: 'GET',
        url: `${process.env.baseUrl}/api/auth`,
      }).catch((err: Error) => {
        console.error({ err });
        return null;
      });

      if (res?.data.access_token != null) {
        this.$commit('auth/SET_TOKEN', res.data.access_token);
        await this.$dispatch('auth/getUserData');

        this.$router.push('/');
        return;
      } if (res?.data.url != null) {
        window.location.href = res.data.url;
        return;
      }
      console.error('トークン取得時にエラーが発生しました。');
    },
  },

  head() {
    return {
      title: 'ログイン',
    };
  },
});
</script>

<style lang="scss" module>
.LoginPage {
  .LoginCard {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    min-width: 300px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    & > *:not(:last-child) {
      margin-bottom: 28px;
    }
    &__signupText {
      font-size: 12px;
    }
  }
}
</style>
