import React from "react";
import Link from "next/link";
import styles from "./nav.module.css";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/ssg">SSG</Link>
        </li>
        <li>
          <Link href="/isr">ISR</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
