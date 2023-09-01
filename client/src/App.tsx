import { useState, useEffect } from "react";
import { userContext } from "./context/UserContext";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { checkLogin, logoutUser } from "./services/auth";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    image: "",
    followers: 0,
  });

  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    checkLogin().then((res) => {
      console.log(res);
      if (res.user) {
        setUser(res.user);
      }
    });
  }, []);

  const signOut = () => {
    setUser({
      username: "",
      email: "",
      name: "",
      surname: "",
      image: "",
      followers: 0,
    });
    logoutUser();
  };

  return (
    <div className="h-full bg-gray-200">
      <userContext.Provider value={user}>
        <BrowserRouter>
          <Layout signOut={signOut}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    showFollowing={showFollowing}
                    setShowFollowing={setShowFollowing}
                  />
                }
              />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/:username" element={<Profile />} />
              <Route path="/:username/post/:postId" element={<Profile />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
