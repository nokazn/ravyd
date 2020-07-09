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
              @keydown.enter.prevent
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

            <v-checkbox
              v-model="isCollaborativePlaylist"
              label="コラボプレイリストにする"
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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ExtendedMutationPayload } from 'vuex';

export type Data = {
  isValid: boolean
  playlistName: string
  playlistDescription: string
  playlistArtwork: Blob | undefined
  isPrivatePlaylist: boolean
  isCollaborativePlaylist: boolean
  playlistNameRules: ((v: string) => boolean | string)[]
  isLoading: boolean
  mutationUnsubscriber: (() => void) | undefined
}

// 編集するとき
export type Form = {
  playlistId: string
  name: string,
  description: string,
  artworkSrc: string | undefined,
  isPrivate: boolean
  isCollaborative: boolean
}

export type Handler<T extends | 'create' | 'edit'> = (payload: T extends 'edit' ?
  {
    playlistId: string,
    name: string
    description: string
    isPublic: boolean
    isCollaborative: boolean
  }
  : {
    name: string
    description: string
    isPublic: boolean
    isCollaborative: boolean
  }) => Promise<void>

export const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object as PropType<Form | undefined>,
      default: undefined,
    },
    handler: {
      type: Function as PropType<Handler<'create' | 'edit'>>,
      required: true,
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
    const playlistArtwork = undefined;
    const isPrivatePlaylist = this.form?.isPrivate ?? false;
    const isCollaborativePlaylist = this.form?.isCollaborative ?? false;

    return {
      isValid: playlistName !== '',
      playlistName,
      playlistDescription,
      playlistArtwork,
      isPrivatePlaylist,
      isCollaborativePlaylist,
      playlistNameRules: [
        (v: string) => v !== '' || 'プレイリスト名の入力は必須です。',
      ],
      isLoading: false,
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
    // プレイリストが作成/編集された後、アップロードされた画像があれば更新する
    const subscribePlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/ADD_PLAYLIST' | 'playlists/EDIT_PLAYLIST'>) => {
      if (this.playlistArtwork == null) {
        this.modal = false;
        this.isLoading = false;
        return;
      }

      const { id: playlistId } = mutationPayload.payload;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.$spotify.playlists.uploadPlaylistArtwork({
          playlistId,
          artwork: fileReader.result as string,
        }).then(() => {
          this.modal = false;
          this.$toast.show('primary', `プレイリストを${this.resultText || this.detailText}しました。`);
          this.resetForm();
        }).catch(() => {
          this.$toast.show('error', '画像のアップロードに失敗しました。');
        }).finally(() => {
          this.isLoading = false;
        });
      });

      // @todo
      fileReader.addEventListener('error', (err) => {
        console.warn(err);
        this.isLoading = false;
        this.$toast.show('error', '画像の読み込みに失敗しました。');
      });

      fileReader.readAsDataURL(this.playlistArtwork);
    };

    this.mutationUnsubscriber = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'playlists/ADD_PLAYLIST':
        case 'playlists/EDIT_PLAYLIST':
          subscribePlaylist(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
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
    createPlaylist() {
      const userId = this.$getters()['auth/userId'];
      if (userId == null) return;

      this.isLoading = true;

      this.handler({
        playlistId: this.form?.playlistId,
        name: this.playlistName,
        description: this.playlistDescription,
        isPublic: !this.isPrivatePlaylist,
        isCollaborative: this.isCollaborativePlaylist,
      }).then(() => {
        if (this.playlistArtwork == null) {
          this.modal = false;
          this.isLoading = false;
          this.$toast.show('primary', `プレイリストを${this.resultText || this.detailText}しました。`);
          this.resetForm();
        }
      }).catch((err: Error) => {
        console.error({ err });
        this.isLoading = false;
        this.$toast.show('error', err.message);
      });
    },
    resetForm() {
      this.playlistName = this.form?.name ?? '';
      this.playlistDescription = this.form?.description ?? '';
      this.playlistArtwork = undefined;
      this.isPrivatePlaylist = this.form?.isPrivate ?? false;
      this.isCollaborativePlaylist = this.form?.isCollaborative ?? false;
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
