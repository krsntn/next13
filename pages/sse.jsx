import { useEffect, useState } from "react";
import Meta from "../components/Meta";

export default function SSE() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const source = new EventSource("/api/sse");

    source.onopen = (event) => {
      console.log("start: ", event);
    };
    source.onmessage = (event) => {
      console.log("onmessage: ", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    source.onerror = (event) => {
      console.error("EventSource error", event);
    };

    return () => {
      source.close();
    };
  });

  return (
    <div>
      <Meta title="SSE | Next" />
      <h1>Server-Sent Events (SSE)</h1>
      <div>
        {messages.map((m, i) => {
          return <div key={i}>{m}</div>;
        })}
      </div>
    </div>
  );
}
