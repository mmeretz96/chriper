import { userContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import clsx from "clsx";
const Navbar = (props: { signOut: () => void }) => {
  const user = useContext(userContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogo = () => {
    navigate("/");
  };

  const handleUserProfile = () => {
    navigate("/" + user.username);
  };
  return (
    <nav className=" bg-gray-800  flex justify-center w-full relative">
      <div className="flex items-center justify-between flex-wrap max-w-[1250px] w-full py-6 px-6">
        <div className="flex items-center flex-shrink-0 text-cyan-400 mr-6">
          <span
            className="font-semibold text-2xl tracking-tight hover:cursor-pointer"
            onClick={handleLogo}
          >
            Chirper
          </span>
        </div>
        <div className="w-full block flex-grow md:flex md:items-center md:w-auto">
          <div className="flex-grow flex justify-end">
            {user.username ? (
              <div className="text-white text-sm flex items-center gap-4">
                <a
                  onClick={handleUserProfile}
                  className={clsx(
                    "inline-block text-sm px-4 leading-none rounded cursor-pointer",
                    "text-white",
                    " mt-4 md:mt-0"
                  )}
                >
                  <PersonOutlineOutlinedIcon />
                </a>
                <a
                  onClick={props.signOut}
                  className={clsx(
                    "inline-block text-sm px-4 py-2 leading-none border rounded cursor-pointer",
                    "text-white border-white hover:border-transparent",
                    "hover:text-gray-500 hover:bg-white mt-4 md:mt-0"
                  )}
                >
                  Sign Out
                </a>
                {/*<UserDisplay />*/}
              </div>
            ) : (
              <a
                onClick={handleLogin}
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white mt-4 md:mt-0"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
