import UserDisplay from "../components/UserDisplay";
import { userContext } from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import {
  deletePost,
  getAllPosts,
  getFollowedPosts,
  likePost,
  unlikePost,
} from "../services/posts";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

type Post = {
  id: number;
  name: string;
  surname: string;
  username: string;
  textcontent: string;
  userImage: string;
  postImage: string | null;
  createdAt: string;
  likeCount: number;
  liked: number;
};

type Props = {
  showFollowing: boolean;
  setShowFollowing: (showFollowing: boolean) => void;
};

const Home = (props: Props) => {
  const user = useContext(userContext);
  const [posts, setPosts] = useState<Post[] | []>([]);

  const fetchPosts = async () => {
    if (props.showFollowing === true) {
      const posts = await getFollowedPosts();
      setPosts(posts);
      return;
    }
    const posts = await getAllPosts();
    setPosts(posts);
  };

  useEffect(() => {
    fetchPosts();
  }, [props.showFollowing]);

  const handleCreatePost = () => {
    fetchPosts();
  };

  const handleDeletePost = (post: Post) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    deletePost(post.id).then(() => {
      fetchPosts();
    });
  };

  const handleLikePost = (post: Post) => {
    if (post.liked === 0) {
      likePost(post.id).then(() => {
        fetchPosts();
      });
    } else {
      unlikePost(post.id).then(() => {
        fetchPosts();
      });
    }
  };

  const handleShowAll = () => {
    props.setShowFollowing(false);
  };

  const handleShowFollowing = () => {
    props.setShowFollowing(true);
  };

  return (
    <div className="flex gap-6">
      {user.username && (
        <div className="w-1/3 rounded-md box-border p-2 bg-white h-80">
          <UserDisplay user={user} />
        </div>
      )}

      <div className="flex-1 rounded-md box-border">
        <div className="flex flex-col gap-4">
          {user.username && (
            <div className="bg-white rounded-md p-4">
              <PostForm handleCreatePost={handleCreatePost} />
            </div>
          )}
          <div className="flex justify-evenly">
            <button
              onClick={handleShowAll}
              className="hover:text-blue-500 font-bold"
            >
              Show ALL
            </button>
            <button
              onClick={handleShowFollowing}
              className="hover:text-blue-500 font-bold"
            >
              FOR ME
            </button>
          </div>
          <PostList
            posts={posts}
            handleDeletePost={handleDeletePost}
            handleLikePost={handleLikePost}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
