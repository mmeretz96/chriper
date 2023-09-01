import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { userContext } from "../context/UserContext";
import { useContext } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
type Props = {
  posts: Post[];
  handleDeletePost: any | null;
  handleLikePost: any | null;
};
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

const PostList = (props: Props) => {
  const user = useContext(userContext);
  const navigate = useNavigate();
  const convertDate = (date: string) => {
    const newDate = new Date(date);
    const currentDate = new Date();
    const diff = currentDate.getTime() - newDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return days + " days ago";
  };

  const handleLikeClick = (post: Post) => {
    if (!user.username) return navigate("/login");
    props.handleLikePost(post);
  };

  const handleProfileClick = (username: string) => {
    navigate("/" + username);
  };

  return (
    <>
      {props.posts.map((post: Post) => (
        <div className="bg-white rounded-md p-4 flex flex-col group/card">
          <div className="flex gap-2">
            <div className="h-12 w-12 flex-shrink-0">
              <img
                src={"http://localhost:3030" + post.userImage}
                onClick={() => handleProfileClick(post.username)}
                className="rounded-full h-full w-full object-cover cursor-pointer"
              />
            </div>
            <div className="flex-grow">
              <div className="font-semibold cursor-pointer flex items-center">
                <div onClick={() => handleProfileClick(post.username)}>
                  <span className="font-bold hover:underline">
                    {post.name} {post.surname}
                  </span>{" "}
                  <span className="text-gray-500">@{post.username}</span> -{" "}
                  <span className="text-gray-500 text-sm">
                    {convertDate(post.createdAt)}
                  </span>
                </div>

                {post.username === user.username && (
                  <div className="ml-auto h-6 w-6">
                    <div className="hidden group-hover/card:block">
                      <DeleteOutlineOutlinedIcon
                        onClick={() => props.handleDeletePost(post)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p>{post.textcontent}</p>
              </div>
              {post.postImage && (
                <div className="flex gap-6 pt-2">
                  <div className="">
                    <img
                      src={"http://localhost:3030" + post.postImage}
                      className="object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className=" gap-2 items-end flex justify-end">
            <div className="w-12 h-12"></div>
            <div className="group cursor-pointer flex gap-2 items-center w-14">
              <div className="group-hover:hidden">
                {post.liked ? (
                  <FavoriteIcon style={{ color: "#F4000990" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </div>
              <div className="hidden group-hover:block">
                <FavoriteBorderIcon
                  style={{ color: "#F4000990" }}
                  onClick={() => handleLikeClick(post)}
                />
              </div>
              <div className="text-sm font-semibold text-gray-500 group-hover:text-red-500">
                {post.likeCount}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostList;
