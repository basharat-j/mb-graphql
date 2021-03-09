const parseConfig = (argv) => {
  try {
    const config = JSON.parse(argv[2]);
    config.mountebankCallbackURL = config.callbackURLTemplate.replace(':port', config.port);
    return config;
  } catch (error) {
    return {};
  }
};

const config = parseConfig(process.argv);

export default config;
