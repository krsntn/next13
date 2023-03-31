import ArticleList from "@/components/Article/articleList";
import Header from "@/components/Header";

const Home = (props) => {
  const { articles } = props;

  return (
    <div>
      <Header />
      <ArticleList articles={articles} />
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=6`
  );
  const articles = await res.json();

  return {
    props: { articles },
  };
};
