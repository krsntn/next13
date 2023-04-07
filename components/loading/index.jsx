import { useEffect } from 'react';
import css from './loading.module.scss';

const Loading = ({ show, noMasking = false }) => {
  useEffect(() => {
    document.body.style.overflow = show && !noMasking ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <>
      {show && (
        <div className={`${css.wrapper} ${noMasking ? css.noMasking : ''}`}>
          <div className={css.lds_ring}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
