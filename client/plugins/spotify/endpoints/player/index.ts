import { Context } from '@nuxt/types';

import { getActiveDeviceList } from './getActiveDeviceList';
import { getCurrentlyPlaying } from './getCurrentlyPlaying';
import { getRecentlyPlayed } from './getRecentlyPlayed';
import { next } from './next';
import { pause } from './pause';
import { play } from './play';
import { previous } from './previous';
import { repeat } from './repeat';
import { seek } from './seek';
import { shuffle } from './shuffle';
import { volume } from './volume';
import { transferPlayback } from './transferPlayback';

export const player = (context: Context) => ({
  getActiveDeviceList: getActiveDeviceList(context),
  getCurrentlyPlaying: getCurrentlyPlaying(context),
  getRecentlyPlayed: getRecentlyPlayed(context),
  next: next(context),
  pause: pause(context),
  play: play(context),
  previous: previous(context),
  repeat: repeat(context),
  seek: seek(context),
  shuffle: shuffle(context),
  volume: volume(context),
  transferPlayback: transferPlayback(context),
});
