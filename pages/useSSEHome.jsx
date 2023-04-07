import { SportContext } from "../context/sport";
import { UserContext } from "../context/user";
// import i18n from '../translation/i18n';
import {
  LS_KEYS,
  api,
  apiGET,
  apiSSE,
  filterBetTypes,
  getSBLanguage,
} from "../utils";
import dayjs from "dayjs";
import queryString from "query-string";
import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";

let sseGetEventsClose;
let sseGetSportsClose;

function useSSEHome(selectedTab) {
  const { state: userContext } = useContext(UserContext);
  const { state: sportContext, dispatch: sportDispatch } =
    useContext(SportContext);

  // INFO: cater first load param
  useEffect(() => {
    const { category, sportId } = queryString.parse(location.search);

    let type = "live";
    switch (category) {
      case "0":
        type = "today";
        break;
      case "1":
        type = "live";
        break;
      case "2":
        type = "early";
        break;
      case "3":
        type = "combo";
        break;
      case "4":
        type = "outrights";
        break;
    }

    let selectedSportType = 1;
    switch (sportId) {
      case "1":
        selectedSportType = 1;
        break;
      case "2":
        selectedSportType = 2;
        break;
      case "3":
        selectedSportType = 4;
        break;
      case "4":
        selectedSportType = 5;
        break;
      case "5":
        selectedSportType = 6;
        break;
      case "6":
        selectedSportType = 7;
        break;
      case "7":
        selectedSportType = 8;
        break;
      case "8":
        selectedSportType = 9;
        break;
      case "9":
        selectedSportType = 12;
        break;
      case "10":
        selectedSportType = 18;
        break;
      case "11":
        selectedSportType = 24;
        break;
    }
    sportDispatch({
      type: "update",
      payload: { type, selectedSportType },
    });
  }, []);

  useEffect(() => {
    if (sportContext.type === "outrights") {
      return;
    }

    if (sportContext.sbDomain && userContext.sbAccessToken) {
      const source = {
        openFn: function () {},
        messageFn: function (event) {
          if (event.data === "KEEPALIVE") {
            sportDispatch({ type: "eventsKeepAlive" });
          } else {
            const data = JSON.parse(event.data);
            const { payload } = data;

            const newEvents = payload.events.add;
            const changeEvents = payload.events.change;
            const removeEvents = payload.events.remove;

            if (newEvents) {
              sportDispatch({
                type: "addEvents",
                payload: { data: newEvents },
              });
            }

            if (changeEvents) {
              sportDispatch({
                type: "updateEvents",
                payload: { data: changeEvents },
              });
            }

            if (removeEvents) {
              sportDispatch({
                type: "removeEvents",
                payload: { data: removeEvents },
              });
            }

            const newMarkets = payload.markets.add;
            const changeMarkets = payload.markets.change;
            const removeMarkets = payload.markets.remove;

            if (newMarkets) {
              sportDispatch({
                type: "addMarkets",
                payload: { data: newMarkets },
              });
            }

            if (changeMarkets) {
              sportDispatch({
                type: "updateMarkets",
                payload: { data: changeMarkets },
              });
            }

            if (removeMarkets) {
              sportDispatch({
                type: "removeMarkets",
                payload: { data: removeMarkets },
              });
            }
          }
        },
        errorFn: function () {
          toast.error("An error occurred while attempting to connect.");
        },
      };

      let startDate = null,
        endDate = null;
      if (["today", "live"].includes(sportContext.type)) {
        startDate = dayjs().startOf("day").utc().format();
        endDate = dayjs().endOf("day").utc().format();
      } else if (["early", "combo"].includes(sportContext.type)) {
        if (typeof sportContext.filteredDate === "string") {
          if (sportContext.filteredDate === "others") {
            startDate = dayjs().add(8, "days").startOf("day").utc().format();
          }
        } else {
          startDate = sportContext.filteredDate.startOf("day").utc().format();
          endDate = sportContext.filteredDate.endOf("day").utc().format();
        }
      }

      const params = {
        token: userContext.sbAccessToken,
        language: getSBLanguage(),
        query: `$filter=sporttype eq ${sportContext.selectedSportType}${
          sportContext.type === "today" ? ` and isLive eq false` : ""
        }${sportContext.type === "live" ? ` and isLive eq true` : ""}${
          sportContext.type === "combo" ? ` and isparlay eq true` : ""
        }${
          sportContext.type === "combo"
            ? ` and isLive eq ${selectedTab === "running"}`
            : ""
        }${userContext.sort === "time" ? `&$orderBy=globalshowtime asc` : ""}`,
        includeMarkets: `$filter=bettype in (${filterBetTypes(
          sportContext.selectedSportType
        ).join(",")}) and sort eq ${
          sportContext.selectedSportType === 43 ? 0 : 1
        }`,
        from: startDate,
        until: endDate,
      };

      if (!startDate) {
        delete params.from;
      }
      if (!endDate) {
        delete params.until;
      }

      sseGetEventsClose = apiSSE(
        `${sportContext.sbDomain}/${api.sseSBGetEvents}`,
        params,
        source
      );
    }

    return () => {
      sseGetEventsClose && sseGetEventsClose();
      // sportDispatch({ type: "resetEventsAndMarkets" });
    };
  }, [
    sportContext.type,
    sportContext.filteredDate,
    sportContext.sbDomain,
    sportContext.selectedSportType,
    userContext.sbAccessToken,
    userContext.sort,
    userContext.tzOffset,
    selectedTab,
  ]);

  // useEffect(() => {
  //   if (sportContext.sbDomain && userContext.sbAccessToken) {
  //     const source = {
  //       openFn: function () {},
  //       messageFn: function (event) {
  //         if (event.data !== "KEEPALIVE") {
  //           const data = JSON.parse(event.data);
  //           const { payload } = data;
  //
  //           const newSports = payload.sports.add;
  //           const changeSports = payload.sports.change;
  //           const removeSports = payload.sports.remove;
  //
  //           if (newSports) {
  //             sportDispatch({
  //               type: "addSports",
  //               payload: { data: newSports },
  //             });
  //           }
  //
  //           if (changeSports) {
  //             sportDispatch({
  //               type: "updateSports",
  //               payload: { data: changeSports },
  //             });
  //           }
  //
  //           if (removeSports) {
  //             sportDispatch({
  //               type: "removeSports",
  //               payload: { data: removeSports },
  //             });
  //           }
  //         }
  //       },
  //       errorFn: function () {
  //         toast.error("An error occurred while attempting to connect.");
  //       },
  //     };
  //
  //     let startDate = null,
  //       endDate = null;
  //     if (["today", "live"].includes(sportContext.type)) {
  //       startDate = dayjs().startOf("day").utc().format();
  //       endDate = dayjs().endOf("day").utc().format();
  //     } else if (["early", "combo"].includes(sportContext.type)) {
  //       if (typeof sportContext.filteredDate === "string") {
  //         if (sportContext.filteredDate === "others") {
  //           startDate = dayjs().add(8, "days").startOf("day").utc().format();
  //         }
  //       } else {
  //         startDate = sportContext.filteredDate.startOf("day").utc().format();
  //         endDate = sportContext.filteredDate.endOf("day").utc().format();
  //       }
  //     } else if (sportContext.type === "outrights") {
  //       startDate = dayjs().startOf("day").utc().format();
  //       endDate = dayjs().add(6, "months").endOf("day").utc().format();
  //     }
  //
  //     const params = {
  //       token: userContext.sbAccessToken,
  //       language: getSBLanguage(),
  //       from: startDate,
  //       until: endDate,
  //     };
  //
  //     if (!startDate) {
  //       delete params.from;
  //     }
  //     if (!endDate) {
  //       delete params.until;
  //     }
  //
  //     sseGetSportsClose = apiSSE(
  //       `${sportContext.sbDomain}/${api.sseSBGetSports}`,
  //       params,
  //       source
  //     );
  //   }
  //
  //   return () => {
  //     sseGetSportsClose && sseGetSportsClose();
  //     sportDispatch({ type: "resetSports" });
  //   };
  // }, [
  //   sportContext.type,
  //   sportContext.sbDomain,
  //   sportContext.filteredDate,
  //   userContext.sbAccessToken,
  // ]);

  useEffect(() => {
    if (sportContext.sbDomain && sportContext.type === "outrights") {
      const url = new URL(`${sportContext.sbDomain}/${api.apiGetOutrights}`);
      url.searchParams.set("language", getSBLanguage());
      url.searchParams.set(
        "query",
        `$filter=sporttype eq ${sportContext.selectedSportType}`
      );

      apiGET(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            LS_KEYS.SB_ACCESS_TOKEN
          )}`,
        },
      }).then((response) => {
        sportDispatch({
          type: "update",
          payload: { outrights: response.outrights },
        });
      });
    }
  }, [
    sportContext.type,
    sportContext.sbDomain,
    sportContext.selectedSportType,
    userContext.tzOffset,
  ]);
}

export default useSSEHome;
