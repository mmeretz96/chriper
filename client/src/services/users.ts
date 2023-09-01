import Axios from "axios";

const baseURI = "http://localhost:3030/";

export async function getUserByUsername(username: string | null) {
  const res = await Axios.get(`${baseURI}profile?username=${username}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function followUser(userId: number) {
  const res = await Axios.post(
    `${baseURI}follow`,
    { followId: userId },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function unfollowUser(id: number | null) {
  const res = await Axios.delete(`${baseURI}follow/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
