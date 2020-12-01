
const webpackPaths = (crc) => {
  return {
    publicPath:`${crc.beta ? '/beta': ''}/apps/${crc.name}/`,
    viewPath: `${crc.beta ? '/beta': ''}/${crc.bundle}/${crc.name}/`,
    viewPathRewritePattern: `^${crc.beta ? '/beta': ''}/${crc.bundle}/${crc.name}/`
  }
}

exports.webpackPaths = webpackPaths;
