import Axios from "axios";

const baseURI = "http://localhost:3030/auth";

export async function registerUser(userData: FormData) {
  const res = await Axios.post(baseURI + "/register", userData);
  return res.data;
}

export async function checkUsername(username: string) {
  const res = await Axios.get(baseURI + "/checkUsername/" + username);
  return res.data;
}

export async function loginUser(userData: {
  username: string;
  password: string;
}) {
  const res = await Axios.post(baseURI + "/login", userData, {
    withCredentials: true,
  });
  return res.data;
}

export async function checkLogin() {
  const res = await Axios.get(baseURI + "/checkLogin", {
    withCredentials: true,
  });
  return res.data;
}

export async function logoutUser() {
  const res = await Axios.get(baseURI + "/logout", { withCredentials: true });
  return res.data;
}
