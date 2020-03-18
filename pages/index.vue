<template>
  <v-card class="auth-card">
    <v-icon
      :size="150">
      mdi-account-circle
    </v-icon>
    <v-btn
      rounded
      color="green lighten-2"
      class="auth-card__button"
      @click="onAuthButtonClicked">
      Spotify アカウントで認証
    </v-btn>
    <p class="auth-card__signup-text">
      アカウントをお持ちでない場合は
      <a
        href="//www.spotify.com/jp/signup/"
        target="_blank">
        新規作成
      </a>
    </p>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onAuthButtonClicked() {},
  },
});
</script>

<style lang="scss" scoped>
.auth-card {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  & > *:not(:last-child) {
    margin-bottom: 28px;
  }
  &__signup-text {
    font-size: 12px;
  }
}
</style>
