import React from "react";
import Meta from "@/components/Meta";
import Link from "next/link";
import styles from "./article.module.css";

export default function ArticlePage({ article, date }) {
  return (
    <div className={styles.container}>
      <Meta title={`${article.title} | Next`} />
      <h1 className={styles.title}>{article.title}</h1>
      <h3>{date}</h3>
      <p>{article.body}</p>
      <Link href="/" className={styles.button}>
        &larr; Go Back
      </Link>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${context.params.id}`
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

// export const getStaticProps = async (context) => {
//   const res = await fetch(
//     `https://jsonplaceholder.typicode.com/posts/${context.params.id}`
//   );
//   const article = await res.json();

//   return {
//     props: {
//       article,
//     },
//   };
// };

// export const getStaticPaths = async (context) => {
//   const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
//   const articles = await res.json();

//   const articleIds = articles.map((x) => x.id);

//   return {
//     paths: articleIds.map((id) => ({ params: { id: id.toString() } })),
//     fallback: false,
//   };
// };
