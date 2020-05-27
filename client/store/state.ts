import { Swatch } from 'node-vibrant/lib/color';

export type RootState = {
  dominantBackgroundColor: Swatch | undefined
}

const state = (): RootState => ({
  dominantBackgroundColor: undefined,
});

export default state;
