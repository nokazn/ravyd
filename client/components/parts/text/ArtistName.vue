<template>
  <div :class="[$style.ArtistName, 'g-text-gradation']">
    <div
      id="artistNameLink"
      :style="marqueeStyles"
      @mouseover="onHovered">
      <template
        v-for="({ name, id }, index) in artistList">
        <nuxt-link
          :key="id"
          :to="artistsPath(id)">
          {{ name }}
        </nuxt-link>
        <span
          v-if="index !== artistList.length - 1"
          :key="`${id}-comma`">, </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { hasProp } from '~~/utils/hasProp';
import { sleep } from '~~/utils/sleep';

export type Artists = {
  name: string
  id: string
}[]

export type Data = {
  isHovered: boolean
  animationTimeoutId: ReturnType<typeof setTimeout> | null
  parentWidth: number | null
  linkWidth: number | null
}

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<Artists>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
  },

  data(): Data {
    return {
      isHovered: false,
      animationTimeoutId: null,
      parentWidth: null,
      linkWidth: null,
    };
  },

  computed: {
    artistsPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
    marqueeSeconds(): number | null {
      if (!this.isHovered || this.parentWidth == null || this.linkWidth == null) return null;
      if (this.linkWidth < this.parentWidth * 0.95) return null;

      const widthPerSeconds = 30;
      return Math.ceil((this.linkWidth / widthPerSeconds));
    },
    marqueeStyles(): { animation: string } | null {
      return this.marqueeSeconds != null
        ? { animation: `marquee ${this.marqueeSeconds}s linear 1` }
        : null;
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
      const linkEle = document.getElementById('artistNameLink');
      if (linkEle == null) {
        console.error('Not Found Element of which id is "artistNameLink"');
        return;
      }

      this.linkWidth = linkEle?.clientWidth ?? null;
      const parentElement = linkEle?.parentElement;
      this.parentWidth = parentElement?.clientWidth ?? null;
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
      this.animationTimeoutId = null;
      this.isHovered = false;
    },
  },
});
</script>

<style lang="scss" module>
.ArtistName {
  color: $g-subtitle-color;
  font-size: 0.7rem;
  line-height: 1rem;
  padding: 0 8px;
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
