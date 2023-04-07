import Layout from "../components/layout";
import "../styles/global.css";
import Stores from "@/context";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function MyApp({ Component, pageProps }) {
  return (
    <Stores>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Stores>
  );
}

export default MyApp;
