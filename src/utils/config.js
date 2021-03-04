const config = JSON.parse(process.argv[2]);
config.mountebankCallbackURL = config.callbackURLTemplate.replace(':port', config.port);

export default config;
