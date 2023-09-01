import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { followUser, getUserByUsername, unfollowUser } from "../services/users";
import {
  deletePost,
  getPostByUsername,
  likePost,
  unlikePost,
} from "../services/posts";
import PostList from "../components/PostList";
import UserDisplay from "../components/UserDisplay";
import { userContext } from "../context/UserContext";

const Profile = () => {
  const params = useParams();
  const user = useContext(userContext);
  const username = params.username as string;
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState({
    id: 0,
    name: "",
    surname: "",
    username: "",
    email: "",
    image: "",
    isFollowing: 0,
    followers: 0,
  });
  const [userPosts, setUserPosts] = useState([]) as any[];

  const fetchPosts = async () => {
    const posts = await getPostByUsername(username);
    setUserPosts(posts);
  };

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    getUserByUsername(username).then((res) => {
      setProfileUser(res[0]);
    });

    fetchPosts();
  }, []);

  const handleDeletePost = (post: any) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    deletePost(post.id).then(() => {
      fetchPosts();
    });
  };

  const handleLikePost = (post: any) => {
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

  const handleFollow = () => {
    followUser(profileUser.id).then(() => {
      setProfileUser({
        ...profileUser,
        isFollowing: 1,
        followers: profileUser.followers + 1,
      });
    });
  };

  const handleUnfollow = () => {
    unfollowUser(profileUser.id).then(() => {
      setProfileUser({
        ...profileUser,
        isFollowing: 0,
        followers: profileUser.followers - 1,
      });
    });
  };

  //check if user is logged in and if it is his profile
  if (user.username && user.username === username) {
    return (
      <div>
        <div>
          <h2 className="text-4xl font-semibold mb-10">Your Account</h2>
        </div>
        <div className="flex gap-6">
          <div className="w-1/3 rounded-md box-border p-2 bg-white h-80">
            <UserDisplay user={profileUser} />
            <div className="font-semibold px-4 text-gray-500">
              <div>Email: {user.email}</div>
            </div>
          </div>
          <div className="flex-1 rounded-md box-border">
            <div className="flex flex-col gap-4">
              <PostList
                posts={userPosts}
                handleDeletePost={handleDeletePost}
                handleLikePost={handleLikePost}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-4xl font-semibold mb-10">Profile</h2>
      </div>
      <div className="flex gap-6">
        <div className="w-1/3 rounded-md box-border p-2 bg-white h-80">
          <UserDisplay user={profileUser} />
          <div className="font-semibold px-4 text-gray-500">
            {profileUser.isFollowing === 0 && (
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-full"
                onClick={handleFollow}
              >
                FOLLOW
              </button>
            )}

            {profileUser.isFollowing === 1 && (
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-full"
                onClick={handleUnfollow}
              >
                UNFOLLOW
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 rounded-md box-border">
          <div className="flex flex-col gap-4">
            <PostList
              posts={userPosts}
              handleDeletePost={handleDeletePost}
              handleLikePost={handleLikePost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
