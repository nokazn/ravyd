import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';

beforeEach(() => {
  // vuetify を使用するための wrapper
  const app = document.createElement('div');
  app.setAttribute('data-app', true);
  document.body.append(app);

  // dayjs の拡張プラグインの設定
  dayjs.locale('ja');
  dayjs.extend(relativeTime);

  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllMocks();
});
