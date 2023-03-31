import React from "react";
import styles from "./header.module.css";

export default function Header() {
  return (
    <div>
      <h1 className={styles.title}>
        <span>Demo</span> Nextjs
      </h1>
      <p className={styles.description}>A sample site to test/demo Nextjs</p>
      <p className={styles.note}>
        Home page uses SSG (getStaticProps) to render below 6 articles, when
        click into the article page, it uses SSR (getServerSideProps) to
        retrieve the details of the article by article id (which the id can be
        more than 6).
      </p>
    </div>
  );
}
