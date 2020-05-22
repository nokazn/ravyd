import { Context } from '@nuxt/types';

import { albums } from './albums';
import { artists } from './artists';
import { browse } from './browse';
import { library } from './library';
import { player } from './player';
import { top } from './top';
import { user } from './user';

export const endpoints = (context: Context) => ({
  albums: albums(context),
  artists: artists(context),
  browse: browse(context),
  library: library(context),
  player: player(context),
  top: top(context),
  user: user(context),
});

const spotifyEndpoints = (context: Context) => endpoints(context);
export type SpotifyEndpoints = ReturnType<typeof spotifyEndpoints>
