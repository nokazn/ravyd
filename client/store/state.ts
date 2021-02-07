import type { App } from '~/entities';

export type RootState = {
  dominantBackgroundColor: App.DominantColor | undefined;
}

const state = (): RootState => ({
  dominantBackgroundColor: undefined,
});

export default state;
