// vuetify を使用するための wrapper
global.beforeEach(() => {
  const app = document.createElement('div');
  app.setAttribute('data-app', true);
  document.body.append(app);
});
