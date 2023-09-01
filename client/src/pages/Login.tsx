//react function component skeleton

import { userContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

type User = {
  username: string;
  email: string;
  name: string;
  surname: string;
  image: string;
  followers: number;
};

type Props = {
  setUser: (user: User) => void;
};

const Login = (props: Props) => {
  const user = useContext(userContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (user.username) {
    return (
      <div className="flex justify-center pt-20 font-bold text-gray-500">
        Already logged in ({user.username})
      </div>
    );
  }

  const handleSubmit = () => {
    loginUser({ username, password })
      .then((res) => {
        console.log(res);

        if (res.user) {
          props.setUser(res.user);
          navigate("/");
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="flex justify-center pt-20">
      <form className="w-full max-w-sm">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-username"
            >
              Username
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-username"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-2">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-password"
              type="password"
              placeholder="******************"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="md:flex md:items-center mb-4">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          </div>
        )}

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3"></div>
          <div className="text-sm ">
            No Account?{" "}
            <span
              className="text-purple-500 cursor-pointer hover:underline"
              onClick={handleSignUp}
            >
              Sign Up here
            </span>
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
