import Link from "next/link";
import Meta from "../components/Meta";
import styles from "./article/article.module.css";

export default function SSR({ article, date }) {
  return (
    <div className={styles.container}>
      <Meta title="SSE | Next" />
      <h1>Server Side Rendering</h1>
      <h3>{date}</h3>
      <p>{article.body}</p>
      <Link href="/" className={styles.button}>
        &larr; Go Back
      </Link>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${Math.floor(
      Math.random() * 5 + 1
    )}`
  );
  const article = await res.json();

  const date = new Date();
  return {
    props: {
      article,
      date: date.toString(),
    },
  };
}
