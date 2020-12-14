import React from 'react';

export interface IAuthContext {
  getToken: () => Promise<string>
}

export const AuthContext = React.createContext<IAuthContext>({
    getToken: () => Promise.resolve('')
  }
);
