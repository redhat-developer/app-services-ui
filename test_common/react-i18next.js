const reacti18next = jest.genMockFromModule("react-i18next");

reacti18next.useTranslation = () => {
  return {
    t: (key) => key,
  };
};

reacti18next.withTranslation = () => (Component) => {
  Component.defaultProps = { ...Component.defaultProps, t: () => "" };
  return Component;
};

module.exports = reacti18next;
