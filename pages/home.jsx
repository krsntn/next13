import HomePanel from "../components/homePanel";
import HomeTable from "../components/homeTable";
import Loading from "../components/loading";
import LoadingScreen from "../components/loadingScreen";
import { SportContext } from "../context/sport";
import { UserContext } from "../context/user";
import { LS_KEYS, api, apiGET, apiPost, mapOddsTypes } from "../utils";
import css from "./home.module.scss";
import useSSEHome from "./useSSEHome";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export async function getServerSideProps(context) {
  const sbDomain = await apiGET(
    `https://ipis-sitwap2.bdrtsy.net/${api.apiGetSBDomain}`,
    {
      headers: {
        authorization: `bearer ${context.query.access_token}`,
      },
    }
  );

  const loginData = await apiPost(
    `https://ipis-sitwap2.bdrtsy.net/${api.apiSBLogin}`,
    {},
    {
      headers: {
        authorization: `bearer ${context.query.access_token}`,
      },
    }
  );

  const sbData = await apiGET(
    `${sbDomain.data}/${api.apiGetEvents}?query=$filter=sporttype eq 1`,
    {
      headers: {
        Authorization: `Bearer ${loginData.data}`,
      },
    }
  );

  let displayLiveEvents = sbData.events.filter((x) => x.isLive === true);
  let displayFollowingEvents = sbData.events.filter((x) => x.isLive === false);

  let liveLeagues = [
    ...new Map(
      displayLiveEvents?.map((x) => [x.leagueId, x.leagueName]).values()
    ),
  ];

  let followingLeagues = [
    ...new Map(
      displayFollowingEvents?.map((x) => [x.leagueId, x.leagueName]).values()
    ),
  ];

  const liveData = [];
  const notStartedData = [];

  liveLeagues.map(([id, name]) => {
    const liveEvents = [];

    displayLiveEvents
      .filter((x) => x.eventStatus === "running")
      .forEach((x) => {
        const event = x;
        event.markets = sbData.markets.filter((y) => y.eventId === x.eventId);
        if (x.leagueId === id && event.markets.length > 0) {
          const existingEvent = liveEvents.find(
            (data) => event.parentId !== 0 && data.parentId === event.parentId
          );

          if (existingEvent) {
            existingEvent.markets = [
              ...existingEvent.markets,
              ...event.markets,
            ];
          } else {
            liveEvents.push(event);
          }
        }
      });

    if (liveEvents.length) {
      liveData.push({
        leagueId: id,
        leagueName: name,
        events: liveEvents,
      });
    }
  });

  followingLeagues.map(([id, name]) => {
    const notStartedEvents = [];

    displayFollowingEvents
      .filter((x) => x.eventStatus === "running")
      .forEach((x) => {
        const event = x;
        event.markets = sbData.markets.filter((y) => y.eventId === x.eventId);
        if (x.leagueId === id && event.markets.length > 0) {
          const existingEvent = notStartedEvents.find(
            (data) => event.parentId !== 0 && data.parentId === event.parentId
          );

          if (existingEvent) {
            existingEvent.markets = [
              ...existingEvent.markets,
              ...event.markets,
            ];
          } else {
            notStartedEvents.push(event);
          }
        }
      });

    if (notStartedEvents.length) {
      notStartedData.push({
        leagueId: id,
        leagueName: name,
        events: notStartedEvents,
      });
    }
  });

  return {
    props: {
      sbDomain: sbDomain.data,
      sbAccessToken: loginData.data,
      events: sbData.events,
      markets: sbData.markets,
      serverLiveData: liveData,
      serverNotStartedData: notStartedData,
    },
  };
}

const HomePage = ({
  sbDomain,
  sbAccessToken,
  events,
  markets,
  serverLiveData,
  serverNotStartedData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningPanelExpand, setIsRunningPanelExpand] = useState(true);
  const [isNotStartedPanelExpand, setIsNotStartedPanelExpand] = useState(true);
  const [selectedTab, setSelectedTab] = useState("running");
  const [displayLiveData, setDisplayLiveData] = useState(() => serverLiveData);
  const [displayNotStartedData, setDisplayNotStartedData] = useState(
    () => serverNotStartedData
  );

  const { state: userContext, dispatch: userDispatch } =
    useContext(UserContext);
  const { state: sportContext, dispatch: sportDispatch } =
    useContext(SportContext);

  useEffect(() => {
    sportDispatch({
      type: "update",
      payload: {
        sbDomain,
        events,
        markets,
      },
    });

    userDispatch({
      type: "update",
      payload: {
        sbAccessToken,
      },
    });
  }, []);

  useSSEHome(selectedTab);

  useEffect(() => {
    if (!sportContext.sbDomain) return;

    let displayLiveEvents = sportContext.events?.filter(
      (x) => x.isLive === true
    );
    let displayFollowingEvents = sportContext.events?.filter(
      (x) => x.isLive === false
    );

    let liveLeagues = [
      ...new Map(
        displayLiveEvents?.map((x) => [x.leagueId, x.leagueName]).values()
      ),
    ];

    let followingLeagues = [
      ...new Map(
        displayFollowingEvents?.map((x) => [x.leagueId, x.leagueName]).values()
      ),
    ];

    const liveData = [];
    const notStartedData = [];

    liveLeagues.map(([id, name]) => {
      const liveEvents = [];

      displayLiveEvents
        .filter((x) => x.eventStatus === "running")
        .forEach((x) => {
          const event = x;
          event.markets = sportContext.markets.filter(
            (y) =>
              y.eventId === x.eventId &&
              (sportContext.type === "combo" ? y.combo !== 0 : true)
          );
          if (x.leagueId === id && event.markets.length > 0) {
            const existingEvent = liveEvents.find(
              (data) => event.parentId !== 0 && data.parentId === event.parentId
            );

            if (existingEvent) {
              existingEvent.markets = [
                ...existingEvent.markets,
                ...event.markets,
              ];
            } else {
              liveEvents.push(event);
            }
          }
        });

      if (liveEvents.length) {
        liveData.push({
          leagueId: id,
          leagueName: name,
          events: liveEvents,
        });
      }
    });

    followingLeagues.map(([id, name]) => {
      const notStartedEvents = [];

      displayFollowingEvents
        .filter((x) => x.eventStatus === "running")
        .forEach((x) => {
          const event = x;
          event.markets = sportContext.markets.filter(
            (y) =>
              y.eventId === x.eventId &&
              (sportContext.type === "combo" ? y.combo !== 0 : true)
          );
          if (x.leagueId === id && event.markets.length > 0) {
            const existingEvent = notStartedEvents.find(
              (data) => event.parentId !== 0 && data.parentId === event.parentId
            );

            if (existingEvent) {
              existingEvent.markets = [
                ...existingEvent.markets,
                ...event.markets,
              ];
            } else {
              notStartedEvents.push(event);
            }
          }
        });

      if (notStartedEvents.length) {
        notStartedData.push({
          leagueId: id,
          leagueName: name,
          events: notStartedEvents,
        });
      }
    });

    setDisplayLiveData(liveData);
    setDisplayNotStartedData(notStartedData);
  }, [sportContext.events, sportContext.markets]);

  const { t } = useTranslation();

  // const [displayLiveData, displayNotStartedData] = useMemo(() => {
  //   const displayEvents = sportContext.filteredEvents
  //     ? sportContext.filteredEvents
  //     : sportContext.displayEvents;
  //   if (displayEvents === null || displayEvents === undefined) {
  //     return [null, null];
  //   }
  //
  //   let displayLiveEvents = displayEvents;
  //   let displayFollowingEvents = displayEvents;
  //
  //   let liveLeagues = [
  //     ...new Map(
  //       displayLiveEvents?.map((x) => [x.leagueId, x.leagueName]).values()
  //     ),
  //   ];
  //
  //   let followingLeagues = [
  //     ...new Map(
  //       displayFollowingEvents?.map((x) => [x.leagueId, x.leagueName]).values()
  //     ),
  //   ];
  //
  //   const liveData = [];
  //   const notStartedData = [];
  //
  //   liveLeagues.map(([id, name]) => {
  //     const liveEvents = [];
  //
  //     displayLiveEvents
  //       .filter((x) => x.eventStatus === "running")
  //       .forEach((x) => {
  //         const event = x;
  //         event.markets = sportContext.displayMarkets.filter(
  //           (y) =>
  //             y.eventId === x.eventId &&
  //             (sportContext.type === "combo" ? y.combo !== 0 : true)
  //         );
  //         if (x.leagueId === id && event.markets.length > 0) {
  //           const existingEvent = liveEvents.find(
  //             (data) => event.parentId !== 0 && data.parentId === event.parentId
  //           );
  //
  //           if (existingEvent) {
  //             existingEvent.markets = [
  //               ...existingEvent.markets,
  //               ...event.markets,
  //             ];
  //           } else {
  //             liveEvents.push(event);
  //           }
  //         }
  //       });
  //
  //     if (liveEvents.length) {
  //       liveData.push({
  //         leagueId: id,
  //         leagueName: name,
  //         events: liveEvents,
  //       });
  //     }
  //   });
  //
  //   followingLeagues.map(([id, name]) => {
  //     const notStartedEvents = [];
  //
  //     displayFollowingEvents
  //       .filter((x) => x.eventStatus === "running")
  //       .forEach((x) => {
  //         const event = x;
  //         event.markets = sportContext.displayMarkets.filter(
  //           (y) =>
  //             y.eventId === x.eventId &&
  //             (sportContext.type === "combo" ? y.combo !== 0 : true)
  //         );
  //         if (x.leagueId === id && event.markets.length > 0) {
  //           const existingEvent = notStartedEvents.find(
  //             (data) => event.parentId !== 0 && data.parentId === event.parentId
  //           );
  //
  //           if (existingEvent) {
  //             existingEvent.markets = [
  //               ...existingEvent.markets,
  //               ...event.markets,
  //             ];
  //           } else {
  //             notStartedEvents.push(event);
  //           }
  //         }
  //       });
  //
  //     if (notStartedEvents.length) {
  //       notStartedData.push({
  //         leagueId: id,
  //         leagueName: name,
  //         events: notStartedEvents,
  //       });
  //     }
  //   });
  //
  //   return [liveData, notStartedData];
  // }, [
  //   sportContext.displayEvents,
  //   sportContext.displayMarkets,
  //   sportContext.filteredEvents,
  // ]);

  const onBettingModalClose = () => {
    sportDispatch({ type: "resetBet" });
  };

  const handleBet = useCallback((selection, data) => {
    return;
  }, []);

  return (
    <>
      <div className={css.main}>
        {((sportContext.type === "combo" && selectedTab === "running") ||
          !["combo", "outrights"].includes(sportContext.type)) &&
        displayLiveData?.length ? (
          <HomeTable
            title={`${t(`homePage.running`)} (${displayLiveData
              ?.map((league) => league.events.length)
              .reduce((acc, cur) => acc + cur, 0)})`}
            isMainPanelExpand={isRunningPanelExpand}
            setIsMainPanelExpand={setIsRunningPanelExpand}
            panelType={1}
            // panelTopPosition={
            //   document.querySelector(`.${css.top}`)?.offsetHeight
            // }
          >
            {displayLiveData.map((league) => {
              return (
                <HomePanel
                  key={league.leagueId}
                  isMainPanelExpand={isRunningPanelExpand}
                  panelType={1}
                  league={league}
                  handleBet={handleBet}
                />
              );
            })}
          </HomeTable>
        ) : null}

        {((sportContext.type === "combo" && selectedTab === "notStarted") ||
          !["combo", "outrights"].includes(sportContext.type)) &&
        displayNotStartedData?.length ? (
          <HomeTable
            title={`${t(`homePage.notStarted`)} (${displayNotStartedData
              ?.map((league) => league.events.length)
              .reduce((acc, cur) => acc + cur, 0)})`}
            isMainPanelExpand={isNotStartedPanelExpand}
            setIsMainPanelExpand={setIsNotStartedPanelExpand}
            panelType={2}
            // panelTopPosition={
            //   document.querySelector(`.${css.top}`)?.offsetHeight
            // }
          >
            {displayNotStartedData.map((league) => {
              return (
                <HomePanel
                  key={league.leagueId}
                  isMainPanelExpand={isNotStartedPanelExpand}
                  panelType={2}
                  league={league}
                  handleBet={handleBet}
                />
              );
            })}
          </HomeTable>
        ) : null}

        <LoadingScreen
          show={
            (sportContext.type !== "outrights" &&
              [undefined, 0].includes(displayLiveData?.length) &&
              [undefined, 0].includes(displayNotStartedData?.length)) ||
            (sportContext.type === "outrights" &&
              [undefined, 0].includes(sportContext.filteredEvents?.length) &&
              [undefined, 0].includes(sportContext.outrights?.length))
          }
          noData={
            (sportContext.type !== "outrights" &&
              displayLiveData?.length === 0 &&
              displayNotStartedData?.length === 0) ||
            (sportContext.type === "outrights" &&
              (sportContext.filteredEvents?.length === 0 ||
                sportContext.outrights?.length === 0))
          }
        />

        <div className={css.loading}>
          {(displayLiveData?.length > 0 ||
            displayNotStartedData?.length > 0) && <Loading show noMasking />}
        </div>
      </div>

      <Loading show={isLoading} />
    </>
  );
};

export default HomePage;
