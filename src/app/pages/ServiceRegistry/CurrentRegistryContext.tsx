import { Registry } from "@rhoas/registry-management-sdk";
import React from "react";

export const CurrentRegistryContext:React.Context<Registry | undefined> = React.createContext<Registry | undefined>(undefined);
