import React from "react";
import Meta from "../components/Meta";

export default function ISR({ date }) {
  return (
    <div>
      <Meta title="ISG | Next" />
      <h1>
        Incremental Static Regeneration, this page will regenerate every 5 mins
      </h1>
      <h3>{date}</h3>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { date: new Date().toString() },
    revalidate: 300,
  };
}
