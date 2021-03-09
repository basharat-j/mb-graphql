import config from '../utils/config';

export default () => {
  const {
    is,
    proxy,
  } = config.defaultResponse || {};
  if (is) {
    return {
      response: is,
    };
  }
  if (proxy) {
    return {
      proxy,
    };
  }
  return {};
};
