function getBaseName(pathname: string) {
  let release = "/";
  const pathName = pathname.split("/");

  pathName.shift();

  if (pathName[0] === "beta") {
    pathName.shift();
    release = `/preview/`;
  }

  return `${release}${pathName[0]}`;
}

export default getBaseName;
