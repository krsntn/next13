import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './scrollToTop.module.scss';

const ScrollToTop = ({ show, style }) => {
  function handleClick() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <>
      {show && (
        <button
          type="button"
          className={css.scrollButton}
          onClick={handleClick}
          style={style}
        >
          <FontAwesomeIcon icon={faAngleUp} className={css.icon} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
