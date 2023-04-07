import { createContext, useReducer } from "react";

const initialState = {
  sbAccessToken: null,
  balance: 0, // from checkUserBalance api
  currency: 0, // from checkUserBalance api
  outstanding: 0, // from checkUserBalance api
  showNoBalancePopUp: false,
  // [START] Keypad ==========
  focusSetState: null,
  showKeypad: false,
  // [END] Keypad ==========
  sort: "time", // hot, time
  oddsType: "hongKongPrice",
  betRecords: null,
  pins: [],
  tzOffset: (new Date().getTimezoneOffset() / 60) * -1,
};

export const UserContext = createContext(initialState);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update":
        return {
          ...state,
          ...action.payload,
        };
      default:
        return {
          ...state,
        };
    }
  }, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
