import { createContext, useReducer } from "react";

const initialState = {
  sbDomain: null,
  selectedSportType: 1,
  type: "today",
  sports: null,
  events: null,
  markets: null,
  displayEvents: null, // for FE layer
  displayMarkets: null, // for FE layer
  outrights: null,
  selectedOutright: null,
  filteredDate: null,
  filteredEvents: null,
  selectedEvents: null, // for bet details page
  betEvent: null,
  betDetails: {},
  showBettingModal: false,
  selectedLeagueIds: [], // for league filter modal
  comboBets: [],
};

export const SportContext = createContext(initialState);

export const SportContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "eventsKeepAlive":
        return {
          ...state,
          events: state.events === null ? [] : state.events,
        };
      case "update":
        return {
          ...state,
          ...action.payload,
        };
      case "addSports":
        return {
          ...state,
          sports:
            state.sports === null
              ? action.payload.data
              : [...state.sports, ...action.payload.data].sort(
                  (a, b) => a.sportType - b.sportType
                ),
        };
      case "updateSports":
        return {
          ...state,
          sports: state.sports.map((existSport) => {
            const sportTypes = action.payload.data.map((x) => x.sportType);
            if (sportTypes.includes(existSport.sportType)) {
              const sport = action.payload.data.find(
                (x) => x.sportType === existSport.sportType
              );
              return { ...existSport, ...sport };
            }

            return existSport;
          }),
        };
      case "removeSports":
        return {
          ...state,
          sports: state.sports.filter(
            (x) => !action.payload.data.includes(x.sportType)
          ),
        };
      case "addEvents":
        return {
          ...state,
          events:
            state.events === null
              ? action.payload.data
              : [...state.events, ...action.payload.data],
        };
      case "updateEvents":
        return {
          ...state,
          events: state.events.map((existEvent) => {
            const ids = action.payload.data.map((x) => x.eventId);
            if (ids.includes(existEvent.eventId)) {
              const event = action.payload.data.find(
                (x) => x.eventId === existEvent.eventId
              );
              return { ...existEvent, ...event };
            }

            return existEvent;
          }),
        };
      case "removeEvents":
        return {
          ...state,
          events: state.events.filter(
            (x) => !action.payload.data.includes(x.eventId)
          ),
        };
      case "addMarkets":
        return {
          ...state,
          markets:
            state.markets === null
              ? action.payload.data
              : [...state.markets, ...action.payload.data],
        };
      case "updateMarkets":
        return {
          ...state,
          markets: state.markets.map((existMarket) => {
            const ids = action.payload.data.map((x) => x.marketId);
            if (ids.includes(existMarket.marketId)) {
              const market = action.payload.data.find(
                (x) => x.marketId === existMarket.marketId
              );

              market.selections = market.selections.map((selection) => {
                const existingSelection = existMarket.selections.find(
                  (x) => x.key === selection.key
                );
                return {
                  ...existingSelection,
                  oddsPriceOld: existingSelection?.oddsPrice,
                  ...selection,
                };
              });

              return { ...existMarket, ...market };
            }

            return existMarket;
          }),
        };
      case "removeMarkets":
        return {
          ...state,
          markets: state.markets.filter(
            (x) => !action.payload.data.includes(x.marketId)
          ),
        };
      case "resetSports":
        return {
          ...state,
          sports: null,
        };
      case "resetEventsAndMarkets":
        return {
          ...state,
          events: null,
          markets: null,
          displayEvents: null,
          displayMarkets: null,
        };
      case "resetBet":
        return {
          ...state,
          betEvent: null,
          betDetails: {},
          showBettingModal: false,
          comboBets: [],
          selectedOutright: null,
        };
      case "resetEventDetails":
        return {
          ...state,
          selectedEvents: null,
        };
      default:
        return {
          ...state,
        };
    }
  }, initialState);

  return (
    <SportContext.Provider value={{ state, dispatch }}>
      {children}
    </SportContext.Provider>
  );
};
