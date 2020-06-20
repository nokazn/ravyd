<template>
  <div>
    <v-dialog
      v-model="modal"
      :max-width="600"
      :class="$style.CreatePlaylistModal"
    >
      <v-card>
        <div :class="$style.CreatePlaylistModal__title">
          <v-card-title>
            プレイリストの作成
          </v-card-title>

          <v-btn
            icon
            title="閉じる"
            @click="onCloseButtonClicked"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>

        <v-card-text>
          <div>
            <v-text-field
              v-model="playlistName"
              autofocus
              label="名前"
              clearable
              required
            />

            <v-textarea
              v-model="playlistDescription"
              label="説明"
              clearable
              :rows="3"
            />

            <v-file-input
              v-model="playlistArtwork"
              label="画像を選択"
              accept="image/*"
              prepend-icon="mdi-camera"
              clearable
              show-size
            />

            <v-checkbox
              v-model="isPrivatePlaylist"
              label="プレイリストを非公開にする"
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <div :class="$style.CreatePlaylistModal__action">
            <v-btn
              text
              rounded
              :min-width="90"
              @click="onCloseButtonClicked"
            >
              キャンセル
            </v-btn>

            <v-btn
              rounded
              :min-width="90"
              color="success"
              :loading="isLoading"
              :disabled="!isValid"
              @click="createPlaylist"
            >
              作成
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar
      v-bind="snackbar"
      @on-changed="onSnackbarChanged"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootMutations } from 'vuex';

import Snackbar, { On as OnSnackbar, SnackbarType } from '~/components/globals/Snackbar.vue';

export type Data = {
  playlistName: string
  playlistDescription: string
  playlistArtwork: Blob | undefined
  isPrivatePlaylist: boolean
  isLoading: boolean
  snackbar: {
    isShown: boolean
    type: SnackbarType
    message: string
  }
  mutationUnsubscriber: (() => void) | undefined
}

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export default Vue.extend({
  components: {
    Snackbar,
  },

  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      playlistName: '',
      playlistDescription: '',
      playlistArtwork: undefined,
      isPrivatePlaylist: false,
      isLoading: false,
      snackbar: {
        isShown: false,
        type: undefined,
        message: '',
      },
      mutationUnsubscriber: undefined,
    };
  },

  computed: {
    modal: {
      get(): boolean {
        return this.isShown;
      },
      set(isShown: boolean) {
        this.$emit(ON_CHANGED, isShown);
      },
    },
    isValid(): boolean {
      return this.playlistName !== '';
    },
  },

  mounted() {
    this.mutationUnsubscriber = this.$store.subscribe((mutation) => {
      const type = mutation.type as keyof RootMutations;
      if (type !== 'playlists/ADD_PLAYLIST') return;
      if (this.playlistArtwork == null) {
        return;
      }

      const playlist = mutation.payload as RootMutations[typeof type];
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.$spotify.playlists.uploadPlaylistArtwork({
          playlistId: playlist.id,
          artwork: fileReader.result as string,
        }).then(() => {
          this.modal = false;
          this.showSnackbar('primary', 'プレイリストを作成しました。');
          this.resetForm();
        }).catch(() => {
          this.showSnackbar('error', '画像のアップロードに失敗しました。');
        });
      });

      // @todo
      fileReader.addEventListener('error', (err) => {
        console.warn(err);
        this.showSnackbar('error', '画像の読み込みに失敗しました。');
      });

      fileReader.readAsDataURL(this.playlistArtwork);
    });
  },

  beforeDestroy() {
    if (this.mutationUnsubscriber != null) {
      this.mutationUnsubscriber();
      this.mutationUnsubscriber = undefined;
    }
  },

  methods: {
    onCloseButtonClicked() {
      this.$emit(ON_CHANGED, false);
    },
    showSnackbar(type: NonNullable<SnackbarType>, message: string) {
      this.isLoading = false;
      this.snackbar = {
        isShown: true,
        type,
        message,
      };
    },
    onSnackbarChanged(isShown: OnSnackbar['on-changed']) {
      this.snackbar = isShown
        ? {
          ...this.snackbar,
          isShown,
        }
        : {
          type: undefined,
          message: '',
          isShown,
        };
    },
    createPlaylist() {
      const userId = this.$getters()['auth/userId'];
      if (userId == null) return;

      this.isLoading = true;

      this.$dispatch('playlists/createPlaylist', {
        name: this.playlistName,
        description: this.playlistDescription,
        isPublic: !this.isPrivatePlaylist,
      }).then(() => {
        if (this.playlistArtwork == null) {
          this.modal = false;
          this.showSnackbar('primary', 'プレイリストを作成しました。');
          this.resetForm();
        }
      }).catch((err: Error) => {
        this.showSnackbar('error', err.message);
      });
    },
    resetForm() {
      this.playlistName = '';
      this.playlistDescription = '';
      this.isPrivatePlaylist = false;
    },
  },
});
</script>

<style lang="scss" module>
.CreatePlaylistModal {
  z-index: z-index-of(modal);

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    & > *:last-child {
      margin-right: 8px;
    }
  }

  &__action {
    padding: 12px;
    width: 100%;
    display: flex;
    justify-content: flex-end;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
