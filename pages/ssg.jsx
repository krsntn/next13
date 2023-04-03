import React from "react";
import Meta from "../components/Meta";

export default function SSG({ date }) {
  return (
    <div>
      <Meta title="SSG | Next" />
      <h1>Static Generation</h1>
      <h3>{date}</h3>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { date: new Date().toString() },
  };
}
