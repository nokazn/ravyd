beforeEach(() => {
  // vuetify を使用するための wrapper
  const app = document.createElement('div');
  app.setAttribute('data-app', true);
  document.body.append(app);
});

afterEach(() => {
  jest.clearAllMocks();
});
