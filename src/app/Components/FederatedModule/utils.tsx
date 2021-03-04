import React from "react";
import {file} from "@babel/types";

export type Utils = {
  [key: string]: {
    entry: string[],
    modules: string[]
  };
};


export const getEntryPoint = async (baseUrl: string, fileName: string, scope: string): Promise<string> => {
  if (fileName.endsWith("json") ){
    const url = `${baseUrl}/${fileName}`;
    console.log(`fetching ${url}`);
    const response = await fetch(url);
    return await response.json().then(json => json as Utils).then(fedMods => fedMods[scope]).then(s => s.entry[0]).then(path => `${baseUrl}/${path}`);
  } else {
    return `${baseUrl}/${fileName}`;
  }
}
