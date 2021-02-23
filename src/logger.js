export default ({
  level = 'info',
  message,
  ...data
}) => {
  const formattedMessage = data
    ? `${level} ${message}\n${JSON.stringify(data, null, 2)}`
    : `${level} ${message}`;
  // eslint-disable-next-line no-console
  console.log(formattedMessage);
};
