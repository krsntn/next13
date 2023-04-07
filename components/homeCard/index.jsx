import AwayTeamImg from "../../assets/images/icons/awayTeam.png";
import HomeTeamImg from "../../assets/images/icons/homeTeam.png";
import LiveMatchImage from "../../assets/images/icons/livematch.png";
import RateDownImage from "../../assets/images/icons/rate_down.svg";
import RateUpImage from "../../assets/images/icons/rate_up.svg";
import SwipeIndicatorGif from "../../assets/images/icons/swipe_indicator.gif";
import { SportContext } from "../../context/sport";
import { UserContext } from "../../context/user";
import { convertUTCToLocal, twoOptionsBetTypes } from "../../utils";
import css from "./homeCard.module.scss";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";

const HomeCard = ({ event, panelType, data, handleBet }) => {
  const { t } = useTranslation();
  const [topSlider, setTopSlider] = useState(null);
  const [slider, setSlider] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { state: userContext } = useContext(UserContext);

  useEffect(() => {
    if (slider && !slider.destroyed && topSlider && !topSlider.destroyed) {
      topSlider.slideTo(activeSlide);
      slider.slideTo(activeSlide);
    }
  }, [topSlider, slider, activeSlide]);

  return (
    <div className={css.container}>
      <div />
      <Swiper
        slidesPerView={1}
        onSlideChange={(item) => setActiveSlide(item.activeIndex)}
        onSwiper={(swiper) => setTopSlider(swiper)}
        longSwipes={false}
        style={{ width: "100%" }}
      >
        {data.length &&
          data.map((section, index) => {
            return (
              <SwiperSlide key={index}>
                <div className={css.columnDesc}>
                  {section.map((item, sectionIndex) => {
                    return (
                      <div className={css.title} key={sectionIndex}>
                        {item.displayBetTypeName}
                      </div>
                    );
                  })}
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
      <div />

      <Link href={`/event/${event.eventId}`} className={css.leftColumn}>
        <div className={css.title}>
          {panelType === 1
            ? event.gameInfo.inPlayTime
            : convertUTCToLocal(event.globalShowTime, userContext.tzOffset)}
        </div>
        <div className={css.team}>
          <img
            src={event.teamInfo.homeIconUrl || HomeTeamImg.src}
            className={css.teamImg}
            alt="home team"
          />
          <div className={css.teamName}>{event.teamInfo.homeName}</div>
          <div className={css.score}>{event.gameInfo.liveHomeScore}</div>
        </div>
        <div className={css.team}>
          <img
            src={event.teamInfo.awayIconUrl || AwayTeamImg.src}
            className={css.teamImg}
            alt="away team"
          />
          <div className={css.teamName}>{event.teamInfo.awayName}</div>
          <div className={css.score}>{event.gameInfo.liveAwayScore}</div>
        </div>
        <div className={css.bottom}>
          <div className={css.watch}>
            <img
              src={LiveMatchImage.src}
              alt="live match"
              className={`${css.liveMatch} ${
                event.isLive && event.streamingOption && event.channelCode
                  ? css.show
                  : ""
              }`}
            />
          </div>
          <div className={css.moreWrapper}>
            <button
              type="button"
              className={css.more}
            >{`${event.marketCount}+ >`}</button>
          </div>
        </div>
      </Link>

      <div className={css.rightColumn}>
        <Swiper
          slidesPerView={1}
          onSlideChange={(item) => setActiveSlide(item.activeIndex)}
          onSwiper={(swiper) => setSlider(swiper)}
          longSwipes={false}
          style={{ height: "100%", width: "100%" }}
        >
          {data.length &&
            data.map((section, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className={css.table}>
                    {section.map((item, i) => {
                      return (
                        <React.Fragment key={i}>
                          <BetWrapper
                            market={item}
                            handleBet={handleBet}
                            userContext={userContext}
                            t={t}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>

        <div className={css.navigator}>
          {data.length > 1 &&
            data.map((_, index) => (
              <div
                key={index}
                className={`${css.dot} ${
                  activeSlide === index ? css.active : ""
                }`}
              />
            ))}
        </div>
      </div>

      <div className={css.indicatorColumn}>
        {slider && !slider.isEnd && (
          <img className={css.icon} src={SwipeIndicatorGif.src} alt="swipe" />
        )}
      </div>
    </div>
  );
};

export default React.memo(HomeCard);

const DashButton = () => {
  return (
    <button type="button" className={css.betButton_dash} disabled>
      -
    </button>
  );
};
const LockButton = () => {
  return (
    <button type="button" className={css.betButton_lock} disabled></button>
  );
};

const BetWrapper = ({ market, handleBet, userContext, t }) => {
  const { state: sportContext, dispatch: sportDispatch } =
    useContext(SportContext);

  const displayOddsType = useMemo(() => {
    return sportContext.type === "combo" ? "parlayPrice" : userContext.oddsType;
  }, [sportContext.type, userContext.oddsType]);

  const onBetButtonClick = (selection, market) => {
    const { type, comboBets } = sportContext;

    if (type === "combo") {
      if (
        comboBets.some(
          (x) =>
            x.marketId === market.marketId && x.selection.key === selection.key
        )
      ) {
        sportDispatch({
          type: "update",
          payload: {
            comboBets: [
              ...comboBets.filter((x) => x.eventId !== market.eventId),
            ],
          },
        });
      } else {
        sportDispatch({
          type: "update",
          payload: {
            comboBets: [
              ...comboBets.filter((x) => x.eventId !== market.eventId),
              {
                combo: market.combo,
                selection,
                sportType: market.sportType,
                betTypeName: market.betTypeName,
                marketId: market.marketId,
                eventId: market.eventId,
                teamInfo: sportContext.events.find(
                  (x) => x.eventId === market.eventId
                )?.teamInfo,
              },
            ],
          },
        });
      }
    } else {
      handleBet(selection, market);
    }
  };

  return (
    <>
      {twoOptionsBetTypes.includes(market.betType) && (
        <div className={css.twoButtons_wrapper}>
          {market.selections.length === 0 && (
            <>
              <DashButton />
              <DashButton />
            </>
          )}

          {market.selections.map((x, index) => {
            return (
              <React.Fragment key={index}>
                {market.marketStatus === "running" && (
                  <button
                    key={index}
                    type="button"
                    className={`${css.betButton} ${
                      sportContext.comboBets.find(
                        (bet) =>
                          bet.marketId === market.marketId &&
                          bet.selection.key === x.key
                      )
                        ? css.tick
                        : ""
                    }`}
                    onClick={() => onBetButtonClick(x, market)}
                  >
                    {[1, 7, 153, 701, 704].includes(market.betType) && (
                      <div className={css.title}>{x.point}</div>
                    )}
                    {[2, 3, 8, 705, 706].includes(market.betType) && (
                      <div className={css.title}>
                        {x.keyName} {x.point}
                      </div>
                    )}
                    {[20, 21].includes(market.betType) && (
                      <>
                        {x.key === "h" && (
                          <div className={css.title}>{t(`bet.home`)}</div>
                        )}
                        {x.key === "a" && (
                          <div className={css.title}>{t(`bet.away`)}</div>
                        )}
                      </>
                    )}

                    <div
                      className={`${css.rate} 
                        ${
                          x.oddsPriceOld &&
                          Number(x.oddsPriceOld[displayOddsType]) >
                            Number(x.oddsPrice[displayOddsType])
                            ? css.changed_down
                            : ""
                        }
                        ${
                          x.oddsPriceOld &&
                          Number(x.oddsPriceOld[displayOddsType]) <
                            Number(x.oddsPrice[displayOddsType])
                            ? css.changed_up
                            : ""
                        } 
                      `}
                    >
                      {x.oddsPriceOld &&
                        Number(x.oddsPriceOld[displayOddsType]) >
                          Number(x.oddsPrice[displayOddsType]) && (
                          <img
                            src={RateDownImage.src}
                            alt="rate icon"
                            className={css.rateChangedIcon}
                          />
                        )}

                      {x.oddsPriceOld &&
                        Number(x.oddsPriceOld[displayOddsType]) <
                          Number(x.oddsPrice[displayOddsType]) && (
                          <img
                            src={RateUpImage.src}
                            alt="rate icon"
                            className={css.rateChangedIcon}
                          />
                        )}
                      {x.oddsPrice[displayOddsType]}
                    </div>
                  </button>
                )}
                {market.marketStatus === "closed" && <DashButton />}
                {["suspend", "closePrice"].includes(market.marketStatus) && (
                  <LockButton />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {!twoOptionsBetTypes.includes(market.betType) && (
        <div
          className={
            market.selections.length === 2
              ? css.twoButtons_wrapper
              : css.threeButtons_wrapper
          }
        >
          {market.selections.length === 0 && (
            <>
              <DashButton />
              <DashButton />
              <DashButton />
            </>
          )}

          {market.selections.map((x, index) => {
            return (
              <React.Fragment key={index}>
                {market.marketStatus === "running" && (
                  <button
                    key={index}
                    type="button"
                    className={`${css.betButton} ${
                      sportContext.comboBets.find(
                        (bet) =>
                          bet.marketId === market.marketId &&
                          bet.selection.key === x.key
                      )
                        ? css.tick
                        : ""
                    }`}
                    onClick={() => onBetButtonClick(x, market)}
                  >
                    {x.key === "1" && (
                      <div className={css.title}>{t(`bet.home`)}</div>
                    )}
                    {x.key === "x" && (
                      <div className={css.title}>{t(`bet.draw`)}</div>
                    )}
                    {x.key === "2" && (
                      <div className={css.title}>{t(`bet.away`)}</div>
                    )}
                    {!["1", "x", "2"].includes(x.key) && (
                      <div className={css.title}>{x.keyName}</div>
                    )}
                    <div className={css.rate}>
                      {x.oddsPrice[displayOddsType]}
                    </div>
                  </button>
                )}
                {market.marketStatus === "closed" && <DashButton />}
                {["suspend", "closePrice"].includes(market.marketStatus) && (
                  <LockButton />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
};
