import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  // replace with useQuery
  // const data = [];

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id], // post.id를 안 넣어주면, 쿼리 구분을 못 해서 업데이트 없이 캐시에 있는 것만 표시해줌
    queryFn: () => fetchComments(post.id), // fetchComments(post.id)를 직접 넣으면 오류
  });

  if (isLoading) {
    return <h3>Now Loading...</h3>;
  }

  if (isError) {
    return <p>{error.toString()}</p>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
