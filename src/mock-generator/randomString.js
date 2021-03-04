import randomInt from './randomInt';
import toSentenceCase from './toSentenceCase';

const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
  .split(' ');

export default () => {
  const start = randomInt(words.length);
  const end = randomInt(words.length - start) + start + 1;
  return toSentenceCase(words.slice(start, end)
    .join(' '));
};
