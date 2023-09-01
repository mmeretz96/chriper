import { useContext, useState } from "react";
import { userContext } from "../context/UserContext";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { createPost } from "../services/posts";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
type Props = {
  handleCreatePost: () => void;
};

const PostForm = (props: Props) => {
  const user = useContext(userContext);
  const [textcontent, setTextcontent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(
    null
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [error, setError] = useState("");

  const submitForm = () => {
    if (textcontent.length === 0 && !image) {
      setError("Please write something or upload an image");
      return;
    } else {
      setError("");
    }
    const formData = new FormData();
    formData.append("textcontent", textcontent);
    if (image) {
      formData.append("image", image);
    }
    console.log(formData.get("textcontent"));
    createPost(formData).then(() => {
      console.log("post created");
      props.handleCreatePost();
      resetForm();
    });
  };

  const handleEmoji = (emoji: any) => {
    setTextcontent(textcontent + emoji.emoji);
    setEmojiPicker(false);
  };

  const resetForm = () => {
    setTextcontent("");
    setImage(null);
    setPreviewImg(null);
    setEmojiPicker(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-6 border-b pb-4">
        <div className="h-12 w-12">
          {" "}
          <img
            src={"http://localhost:3030" + user.image}
            className="rounded-full h-full w-full object-cover cursor-pointer"
          />
        </div>
        <div className="grow">
          <div className="text-gray-800 font-bold text-md">
            <input
              type="text"
              value={textcontent}
              className="bg-gray-200 rounded-full h-12 outline-none px-4 py-2 w-full"
              placeholder="Write text here"
              onChange={(e) => setTextcontent(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-sm font-semibold pl-4">{error}</p>
            )}
          </div>
        </div>
      </div>
      {previewImg && (
        <div className="flex gap-6 p-2">
          <div className="h-12 w-12 shrink-0"></div>
          <div className="">
            <img
              src={previewImg.toString()}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}
      <div className="flex pt-4 pl-2 gap-4">
        <div>
          <label htmlFor="file-input">
            <ImageOutlinedIcon className="text-gray-500 cursor-pointer" />
          </label>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImg(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <div className="ml-auto">
          <EmojiEmotionsOutlinedIcon
            onClick={() => setEmojiPicker(!emojiPicker)}
          />
        </div>
        <div className="">
          <button
            className="ml-auto bg-cyan-400 text-gray-100 font-bold py-1 px-4 rounded-full"
            onClick={submitForm}
          >
            Chirp
          </button>
        </div>
      </div>
      <div className="flex justify-end absolute top-16 right-32 cursor-pointer">
        {emojiPicker && (
          <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
        )}
      </div>
    </div>
  );
};

export default PostForm;
