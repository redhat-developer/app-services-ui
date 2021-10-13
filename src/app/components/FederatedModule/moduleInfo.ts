export type ModuleInfo = {
  entryPoint: string
  basePath: string
}

export type FetchModuleInfoFunction = {
  (baseUrl: string, scope: string, fallbackBasePath?: string): Promise<ModuleInfo | undefined>
}

export const fetchModuleInfo: FetchModuleInfoFunction = async (baseUrl, scope, fallbackBasePath) => {

  const fedModsJsonFileName = "fed-mods.json";

  type FedMods = {
    [key: string]: {
      entry: string[],
      modules: string[]
    };
  };

  const fetchModuleInfo = async (basePath: string) => {
    const url = `${basePath}/${fedModsJsonFileName}`;
    const response = await fetch(url);
    return await response.json()
      .then(json => json as FedMods)
      .then(fedMods => fedMods[scope])
      .then(s => s.entry[0])
      .then(path => {
        if (path.startsWith(basePath)) {
          return {
            entryPoint: path,
            basePath
          };
        }
        return {
          entryPoint: `${basePath}${path}`,
          basePath
        }
      });
  }

  try {
    // First try to fetch the main entry point
    return await fetchModuleInfo(baseUrl);
  } catch (e) {
    if (fallbackBasePath) {
      try {
        // If fetching the main entry point failed, and there is a fallback, try fetching that
        // This allows us to use remote versions locally, transparently
        return await fetchModuleInfo(fallbackBasePath)
      } catch (e1) {
        return undefined;
      }
    }
  }
  return undefined;
}
