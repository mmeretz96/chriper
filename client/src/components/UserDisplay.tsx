import { useNavigate } from "react-router-dom";

type Props = {
  user: any;
};

const UserDisplay = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div
        className="px-4 flex gap-2 hover:cursor-pointer items-center border-b pt-2 pb-4"
        onClick={() => navigate("/" + props.user.username)}
      >
        <div className="h-12 w-12 flex items-center justify-center">
          <img
            src={"http://localhost:3030" + props.user.image}
            className="rounded-full h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="text-gray-800 font-bold text-lg">
            {props.user.name} {props.user.surname}
          </div>
          <div className="text-gray-400 font-semibold">
            @{props.user.username}
          </div>
        </div>
        <div className="ml-auto">
          {props.user.followers === 1 ? (
            <div className="text-gray-400 font-semibold">
              {props.user.followers} Follower
            </div>
          ) : (
            <div className="text-gray-400 font-semibold">
              {props.user.followers} Followers
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pt-2 pb-4"></div>
    </div>
  );
};

export default UserDisplay;
