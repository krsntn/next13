import ArrowUpImg from "../../assets/images/icons/arrowUp.png";
import ClockImage from "../../assets/images/icons/clock.png";
import LoadingGif from "../../assets/images/icons/loading.gif";
import css from "./homeTable.module.scss";

// panelType
// 1 = running
// 2 = not started

const HomeTable = ({
  title,
  isMainPanelExpand,
  setIsMainPanelExpand,
  panelType,
  panelTopPosition,
  children,
}) => {
  if (panelTopPosition) {
    document.documentElement.style.setProperty(
      "--panel-top",
      `${panelTopPosition}px`
    );
  }

  return (
    <div className={css.container}>
      <button
        type="button"
        className={css.panel}
        onClick={() => setIsMainPanelExpand((prev) => !prev)}
      >
        <div className={css.title}>
          <img
            src={panelType === 1 ? LoadingGif.src : ClockImage.src}
            alt="running"
            className={css.runningIcon}
          />
          {title}
          <img
            src={ArrowUpImg.src}
            alt="running"
            className={`${css.icon} ${isMainPanelExpand ? css.active : ""}`}
          />
        </div>
      </button>

      {children}
    </div>
  );
};

export default HomeTable;
