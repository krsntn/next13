import { useTranslation } from 'react-i18next';
import css from './loadingScreen.module.scss';
import NoResultImage from '../../assets/images/no_result.png';

const LoadingScreen = ({ show = false, noData = false }) => {
  const { t } = useTranslation();

  return (
    <>
      {show && (
        <div className={css.wrapper}>
          <img src={NoResultImage} alt="no result" className={css.image} />
          {t(`loadingData.${noData ? 'noData' : 'loading'}`)}
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
