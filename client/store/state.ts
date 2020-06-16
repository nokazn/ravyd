import { App } from '~~/types';

export type RootState = {
  dominantBackgroundColor: App.DominantColorInfo | undefined
}

const state = (): RootState => ({
  dominantBackgroundColor: undefined,
});

export default state;
