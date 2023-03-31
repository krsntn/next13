import React from "react";
import Meta from "../Meta";
import Nav from "../Nav";
import styles from "./layout.module.css";

const Layout = ({ children }) => {
  return (
    <div>
      <Meta />
      <Nav />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>testing site</footer>
      </div>
    </div>
  );
};

export default Layout;
