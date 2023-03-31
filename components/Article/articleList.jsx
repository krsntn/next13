import React from "react";
import Article from "./article";
import styles from "./article.module.css";

const ArticleList = ({ articles }) => {
  return (
    <div className={styles.grid}>
      {articles.map((article, index) => (
        <Article article={article} key={index} />
      ))}
    </div>
  );
};

export default ArticleList;
