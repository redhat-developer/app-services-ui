export const getParams = () => {
  const pathRegex =
    /^.*\/kafkas\/(?<id>[a-zA-Z0-9]+)(\/topics\/(?<topicName>[a-zA-Z0-9-_]+))?$/gm;
  const matches = pathRegex.exec(window.location.pathname);
  if (matches === null || matches.groups === undefined) {
    throw new Error("matches is null or groups are undefined");
  }
  const { id, topicName } = matches.groups;
  if (id === undefined) {
    throw new Error("id cannot be null");
  }
  return { id, topicName };
};
