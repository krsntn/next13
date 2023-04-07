import ArrowUpImg from "../../assets/images/icons/arrowUp.png";
import { filterMarkets } from "../../utils";
import HomeCard from "../homeCard";
import css from "./homePanel.module.scss";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "swiper/swiper.min.css";

function generateMarketsData(events) {
  const availableMarkets = [];
  events.map((event) => {
    const markets = filterMarkets(event.markets);
    if (markets.length > 0) {
      availableMarkets.push({ event, markets });
    }
  });

  return availableMarkets;
}

const HomePanel = ({ isMainPanelExpand, panelType, league, handleBet }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [marketsData, setMarketsData] = useState(() =>
    generateMarketsData(league.events)
  );

  const { t } = useTranslation();

  useEffect(() => {
    setIsOpen(isMainPanelExpand);
  }, [isMainPanelExpand]);

  useEffect(() => {
    setMarketsData(generateMarketsData(league.events));
  }, [league.events]);

  if (marketsData.length === 0) {
    return null;
  }

  return (
    <div className={css.container}>
      <button
        type="button"
        className={`${css.panel} ${panelType === 2 ? css.notStarted : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={css.title}>
          {league.leagueName}{" "}
          <img
            src={ArrowUpImg.src}
            alt="arrow"
            className={`${css.icon} ${isOpen ? css.active : ""}`}
          />
        </div>
      </button>

      <div className={`${css.panelBody} ${isOpen ? css.open : ""}`}>
        {marketsData.map((item, index) => {
          if (item.data?.length === 0) {
            return null;
          }

          return (
            <div key={index}>
              <HomeCard
                key={item.event.eventId}
                event={item.event}
                panelType={panelType}
                data={item.markets}
                handleBet={handleBet}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(HomePanel);
