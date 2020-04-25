import { Plugin } from '@nuxt/types';

const plugin: Plugin = ({ $axios, app }, inject) => {
  $axios.onRequest(() => {
    const token = app.$state().auth.accessToken;
    console.log(token);
    if (token == null) return;

    const spotifyApi = $axios.create({
      baseURL: process.env.spotifyUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    inject('spotifyApi', spotifyApi);
  });

  $axios.onResponseError(async (err) => {
    console.error({ err });
    await app.$dispatch('auth/refreshAccessToken');
  });

  const spotifyApi = $axios.create({
    baseURL: process.env.spotifyUrl,
  });
  inject('spotifyApi', spotifyApi);

  const serverApi = $axios.create({
    baseURL: process.env.baseUrl,
  });
  inject('serverApi', serverApi);
};

export default plugin;
