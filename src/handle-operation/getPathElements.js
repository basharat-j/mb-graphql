const getPathElements = (path) => {
  const {
    prev,
    ...simplePath
  } = path;
  return path.prev
    ? [...getPathElements(path.prev), simplePath]
    : [simplePath];
};

export default getPathElements;
