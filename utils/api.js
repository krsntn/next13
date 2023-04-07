import { getAppLanguage } from "./languageMap";
import { LS_KEYS } from "./localStorage";
import axios from "axios";
import queryString from "query-string";
import toast from "react-hot-toast";

const api = axios.create({
  timeout: 8000,
  // headers: {
  //   authorization: `bearer ${
  //     queryString.parse(location.search).access_token ||
  //     localStorage.getItem(LS_KEYS.TOKEN)
  //   }`,
  //   'accept-language':
  //     queryString.parse(location.search).language || getAppLanguage(),
  // },
});

function apiGET(url, requestData) {
  return new Promise((resolve, reject) => {
    api
      .get(url, requestData)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.error(error);
        if (error?.code === "ERR_CANCELED") return;
        if (error?.response?.data?.message)
          toast.error(error.response.data.message);
        reject(error);
      })
      .finally(function (props) {
        // always executed
      });
  });
}

function apiPost(url, requestData, config = {}) {
  return new Promise((resolve, reject) => {
    api
      .post(url, requestData, config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.error(error);
        if (error?.response?.data?.message)
          toast.error(error.response.data.message);
        reject(error);
      });
  });
}

function apiSSE(api, requestData, { openFn, messageFn, errorFn }) {
  const source = new EventSource(
    `${api}${requestData ? `?${new URLSearchParams(requestData)}` : ""}`,
    {
      Accept: "text/event-stream",
      "Accept-Encoding": "br, gzip, deflate",
    }
  );

  source.onopen = openFn;
  source.onmessage = messageFn;
  source.onerror = errorFn;

  return () => {
    source.close();
  };
}

export { apiGET, apiPost, apiSSE };
