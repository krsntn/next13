import ScrollToTop from "../../components/scrollToTop";
import { SportContext } from "../../context/sport";
import { UserContext } from "../../context/user";
import { LS_KEYS, api, apiGET, apiPost } from "../../utils";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const layout = ({ children }) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { state: userContext, dispatch: userDispatch } =
    useContext(UserContext);
  const { state: sportContext, dispatch: sportDispatch } =
    useContext(SportContext);

  useEffect(() => {
    function scrollFn() {
      setShowScrollToTop(window.scrollY > 100);
    }
    document.addEventListener("scroll", scrollFn);

    return () => {
      document.removeEventListener("scroll", scrollFn);
    };
  }, []);

  return (
    <>
      <Toaster />
      {children}
      <ScrollToTop
        show={showScrollToTop}
        style={sportContext.type === "combo" ? { bottom: "120px" } : null}
      />
    </>
  );
};

export default layout;
