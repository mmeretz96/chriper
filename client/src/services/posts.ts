import Axios from "axios";

const baseURI = "http://localhost:3030/posts";

export async function getAllPosts() {
  const res = await Axios.get(baseURI, { withCredentials: true });
  return res.data;
}

export async function getPostByUsername(username: string | null) {
  const res = await Axios.get(`${baseURI}/user/${username}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function createPost(postData: FormData) {
  const res = await Axios.post(baseURI, postData, { withCredentials: true });
  return res.data;
}

export async function deletePost(postId: number) {
  const res = await Axios.delete(`${baseURI}/${postId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function likePost(postId: number) {
  const res = await Axios.post(`${baseURI}/${postId}/like`, null, {
    withCredentials: true,
  });
  return res.data;
}

export async function unlikePost(postId: number) {
  const res = await Axios.delete(`${baseURI}/${postId}/like`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getFollowedPosts() {
  const res = await Axios.get(`${baseURI}/following`, {
    withCredentials: true,
  });
  return res.data;
}
