/* eslint-disable no-console */
export default ({
  level = 'info',
  message,
  ...data
}) => {
  const formattedMessage = `${level} ${message}`;
  if (level === 'error') {
    console.error(formattedMessage, data);
  } else if (level === 'warn') {
    console.warn(formattedMessage, data);
  } else {
    console.log(formattedMessage, data);
  }
};
