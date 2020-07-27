<template>
  <div
    :title="title"
    :class="$style.MarqueeArtistNames"
    class="g-text-gradation subtext--text"
  >
    <div
      :id="MARQUEE_ARTIST_NAME_LINK"
      :style="marqueeStyles"
      @mouseover="onHovered"
    >
      <template
        v-for="({ name, id }, index) in artistList"
      >
        <nuxt-link
          :key="id"
          :to="artistPath(id)"
        >
          {{ name }}
        </nuxt-link>
        <span
          v-if="index !== artistList.length - 1"
          :key="`${id}-comma`"
        >, </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { hasProp } from '~~/utils/hasProp';
import { sleep } from '~~/utils/sleep';
import { App } from '~~/types';

const MARQUEE_ARTIST_NAME_LINK = 'MARQUEE_ARTIST_NAME_LINK';

type Data = {
  isHovered: boolean
  animationTimeoutId: ReturnType<typeof setTimeout> | undefined
  parentWidth: number | undefined
  linkWidth: number | undefined
  MARQUEE_ARTIST_NAME_LINK: string
}

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
  },

  data(): Data {
    return {
      isHovered: false,
      animationTimeoutId: undefined,
      parentWidth: undefined,
      linkWidth: undefined,
      MARQUEE_ARTIST_NAME_LINK,
    };
  },

  computed: {
    artistPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
    title(): string {
      return this.artistList
        .map((artist) => artist.name)
        .join(', ');
    },
    marqueeSeconds(): number | undefined {
      if (!this.isHovered || this.parentWidth == null || this.linkWidth == null) return undefined;
      if (this.linkWidth < this.parentWidth * 0.95) return undefined;

      const widthPerSeconds = 30;
      return Math.ceil((this.linkWidth / widthPerSeconds));
    },
    marqueeStyles(): { animation: string } | undefined {
      return this.marqueeSeconds != null
        ? { animation: `marquee ${this.marqueeSeconds}s linear 1` }
        : undefined;
    },
  },

  watch: {
    artistList(): void {
      this.clearTimeout();
      this.calculateWidth();
    },
  },

  methods: {
    calculateWidth() {
      const linkEle = document.getElementById(MARQUEE_ARTIST_NAME_LINK);
      if (linkEle == null) {
        console.error(`Not Found Element of which id is "${MARQUEE_ARTIST_NAME_LINK}"`);
        return;
      }

      this.linkWidth = linkEle.clientWidth;
      const { parentElement } = linkEle;
      this.parentWidth = parentElement?.clientWidth;
    },
    async onHovered() {
      this.calculateWidth();
      // 既にアニメーションがスタートしてる場合はキャンセル
      if (this.isHovered) return;

      // ホバーしてから0.5秒後にアニメーションを開始
      const extraMillSeconds = 500;
      await sleep(extraMillSeconds);
      this.isHovered = true;
      if (this.marqueeSeconds == null) {
        this.isHovered = false;
        return;
      }

      // アニメーション終了後に再度アニメーションを受け付けられる状態にする
      this.animationTimeoutId = setTimeout(() => {
        this.isHovered = false;
      }, this.marqueeSeconds * 1000 + extraMillSeconds);
    },
    clearTimeout() {
      if (this.animationTimeoutId != null) clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = undefined;
      this.isHovered = false;
    },
  },
});
</script>

<style lang="scss" module>
.MarqueeArtistNames {
  font-size: 0.8em;
  line-height: 1em;
  padding: 0 0.5em;
  white-space: nowrap;
  position: relative;

  & > * {
    display: inline-block;
  }
}
</style>

<style lang="scss">
@include marquee-animation;
</style>
