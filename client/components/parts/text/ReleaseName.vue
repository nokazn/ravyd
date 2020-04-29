<template>
  <div
    ref="releaseName"
    :class="$style.ReleaseName">
    <nuxt-link
      v-if="releasesPath != null"
      ref="releaseNameLink"
      :to="releasesPath"
      :style="marqueeStyles"
      @mouseover.native="onHovered">
      {{ name }}
    </nuxt-link>
    <span
      v-else
      :style="marqueeStyles"
      @mouseover="onHovered">
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { sleep } from '~~/utils/sleep';

type Data = {
  isHoverd: boolean
  animationTimeoutId: ReturnType<typeof setTimeout> | null
  parentWidth: number | null
  linkWidth: number | null
};

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    releaseId: {
      required: true,
      validator(value) {
        return typeof value === 'string' || value == null;
      },
    },
  },

  data(): Data {
    return {
      isHoverd: false,
      animationTimeoutId: null,
      parentWidth: null,
      linkWidth: null,
    };
  },

  computed: {
    releasesPath(): string | null {
      return this.releaseId != null
        ? `/releases/${this.releaseId}`
        : null;
    },
    marqueeSeconds(): number | null {
      if (!this.isHoverd || this.parentWidth == null || this.linkWidth == null) return null;
      if (this.linkWidth < this.parentWidth) return null;

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
    releaseId(): void {
      this.clearTimeout();
    },
  },

  methods: {
    calculateWidth() {
      console.log(this.$refs);
      const parentEle = this.$refs.releaseName as Element;
      this.parentWidth = parentEle?.getBoundingClientRect().width ?? null;
      const linkEle = this.$refs.releaseNameLink as Vue;
      this.linkWidth = linkEle?.$el.getBoundingClientRect().width ?? null;
    },
    async onHovered() {
      this.calculateWidth();
      // 既にアニメーションがスタートしてる場合はキャンセル
      if (this.isHoverd) return;

      // ホバーしてから0.5秒後にアニメーションを開始
      const extraMillSeconds = 500;
      await sleep(extraMillSeconds);
      this.isHoverd = true;
      if (this.marqueeSeconds == null) {
        this.isHoverd = false;
        return;
      }

      // アニメーション終了後に再度アニメーションを受け付けられる状態にする
      this.animationTimeoutId = setTimeout(() => {
        this.isHoverd = false;
        console.log('onHoverFinished');
      }, this.marqueeSeconds * 1000 + extraMillSeconds);
    },
    clearTimeout() {
      if (this.animationTimeoutId != null) clearTimeout(this.animationTimeoutId);
      this.isHoverd = false;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseName {
  color: $g-title-color;
  font-size: 0.8rem;
  line-height: 1rem;
  padding: 8px;
  white-space: nowrap;
  position: relative;
  & > * {
    display: inline-block;
  }
  &::before {
    position: absolute;
    top: 8px;
    left: 0px;
    content: "";
    padding: 8px 4px;
    background-image: linear-gradient(
      to right,
      rgba($g-bar-background-color, 1),
      rgba($g-bar-background-color, 0),
    );
    z-index: 100;
  }
  &::after {
    position: absolute;
    top: 8px;
    right: 0px;
    content: "";
    padding: 8px 4px;
    background-image: linear-gradient(
      to left,
      rgba($g-bar-background-color, 1),
      rgba($g-bar-background-color, 0),
    );
  }
}
</style>

<style lang="scss">
@include marquee-animation;
</style>
