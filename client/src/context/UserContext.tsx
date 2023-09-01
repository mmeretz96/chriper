import { createContext } from "react";

const userContext = createContext({
  username: "",
  email: "",
  name: "",
  surname: "",
  image: "",
});

export { userContext };
