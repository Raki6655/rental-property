import React from "react";

interface UserContextType {
  userInfo: {},
  validatingToken: boolean,
  tokenRefreshmentInterval: number,
  hubUrl: string,
  permission: boolean,
}
const defaultValue = {
  userInfo: {},
  validatingToken: true,
  tokenRefreshmentInterval: 0,
  hubUrl: "",
  permission: false,
};
export const AppContext = React.createContext<UserContextType | null>(defaultValue || null);

