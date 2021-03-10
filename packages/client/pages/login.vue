<template>
  <div :class="$style.LoginPage">
    <v-card
      v-show="!isLoggedIn"
      :color="$constant.CARD_BACKGROUND_COLOR"
      :class="$style.LoginCard"
    >
      <v-icon :size="150">
        mdi-account-circle
      </v-icon>

      <v-btn
        rounded
        color="success"
        :class="$style.LoginCard__button"
        @click="onAuthButtonClicked"
      >
        Spotify アカウントで認証
      </v-btn>

      <p :class="$style.LoginCard__signupText">
        アカウントをお持ちでない場合は
        <a
          href="//www.spotify.com/jp/signup/"
          target="_blank"
        >
          新規作成
        </a>
      </p>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  head() {
    return {
      title: 'ログイン',
    };
  },

  computed: {
    isLoggedIn(): boolean {
      return this.$getters()['auth/isLoggedIn'];
    },
  },

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  },

  methods: {
    onAuthButtonClicked() {
      this.$dispatch('auth/login');
    },
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
      font-size: 0.8em;
    }
  }
}
</style>
