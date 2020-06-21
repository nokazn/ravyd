<template>
  <div>
    <v-dialog
      v-model="modal"
      :max-width="600"
      :class="$style.PlaylistModal"
    >
      <v-card>
        <div :class="$style.PlaylistModal__title">
          <v-card-title>
            プレイリストの{{ detailText }}
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
          <v-form
            ref="form"
            v-model="isValid"
          >
            <v-text-field
              v-model="playlistName"
              autofocus
              label="名前"
              clearable
              required
              :rules="playlistNameRules"
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
          </v-form>
        </v-card-text>

        <v-card-actions>
          <div :class="$style.PlaylistModal__action">
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
              {{ resultText || detailText }}
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
import Vue, { PropType } from 'vue';
import { RootMutations } from 'vuex';

import Snackbar, { On as OnSnackbar, SnackbarType } from '~/components/globals/Snackbar.vue';

export type Data = {
  isValid: boolean
  playlistName: string
  playlistDescription: string
  playlistArtwork: Blob | undefined
  isPrivatePlaylist: boolean
  playlistNameRules: ((v: string) => boolean | string)[]
  isLoading: boolean
  snackbar: {
    isShown: boolean
    type: SnackbarType
    message: string
  }
  mutationUnsubscriber: (() => void) | undefined
}

type Form = {
  name: string,
  description: string,
  artwork: Blob | undefined,
  isPrivate: boolean
}

export const ON_CHANGED = 'on-changed';

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
    form: {
      type: Object as PropType<Form | undefined>,
      default: undefined,
    },
    detailText: {
      type: String,
      required: true,
    },
    resultText: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const playlistName = this.form?.name ?? '';
    const playlistDescription = this.form?.description ?? '';
    const playlistArtwork = this.form?.artwork;
    const isPrivatePlaylist = this.form?.isPrivate ?? false;

    return {
      isValid: playlistName !== '',
      playlistName,
      playlistDescription,
      playlistArtwork,
      isPrivatePlaylist,
      playlistNameRules: [
        (v: string) => v !== '' || 'プレイリスト名の入力は必須です。',
      ],
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
        if (!isShown && this.$refs.form != null) {
          // モーダルを閉じたときにバリデーションをリセット
          (this.$refs.form as Vue & { resetValidation(): void }).resetValidation();
        }
        this.$emit(ON_CHANGED, isShown);
      },
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
          this.showSnackbar('primary', `プレイリストを${this.resultText || this.detailText}しました。`);
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
          this.showSnackbar('primary', `プレイリストを${this.resultText || this.detailText}しました。`);
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
.PlaylistModal {
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
