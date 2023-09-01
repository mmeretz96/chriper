import { useState } from "react";
import { registerUser, checkUsername } from "../services/auth";
import clsx from "clsx";
import {
  usernameSchema,
  passwordSchema,
  emailSchema,
  nameSchema,
} from "../validations/UserValidation";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

type FieldState = {
  value: string;
  errors: string[];
};

type ImageFile = {
  value: FileList | null;
};

const Signup = () => {
  const [username, setUsername] = useState<FieldState>({
    value: "",
    errors: [],
  });
  const [password, setPassword] = useState<FieldState>({
    value: "",
    errors: [],
  });
  const [email, setEmail] = useState<FieldState>({
    value: "",
    errors: [],
  });
  const [name, setName] = useState<FieldState>({
    value: "",
    errors: [],
  });
  const [surname, setSurname] = useState<FieldState>({
    value: "",
    errors: [],
  });
  const [img, setImg] = useState<ImageFile>({ value: null });

  const navigation = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData();
    data.append("username", username.value);
    data.append("password", password.value);
    data.append("email", email.value);
    data.append("name", name.value);
    data.append("surname", surname.value);
    data.append("image", img.value === null ? "" : img.value[0]);

    console.log(data);

    validateForm();
    isFormValid().then((res) => {
      if (res) {
        console.log("form is valid");
        registerUser(data).then((res) => {
          console.log(res);
          navigation("/login");
        });
      }
    });
  };

  const handleUsernameChange = (newUsername: string) => {
    setUsername({
      value: newUsername,
      errors: validateField("username", newUsername, usernameSchema),
    });
    newUsername.length > 0 &&
      checkUsername(newUsername).then((res) => {
        if (!res.available) {
          setUsername({
            ...username,
            errors: ["Username already exists"],
          });
        }
      });
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword({
      value: newPassword,
      errors: validateField("password", newPassword, passwordSchema),
    });
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail({
      value: newEmail,
      errors: validateField("email", newEmail, emailSchema),
    });
  };

  const handleNameChange = (newName: string) => {
    setName({
      value: newName,
      errors: validateField("name", newName, nameSchema),
    });
  };

  const handleSurnameChange = (newSurname: string) => {
    setSurname({
      value: newSurname,
      errors: validateField("name", newSurname, nameSchema),
    });
  };

  const validateField = (
    field: string,
    value: string,
    schema: Yup.Schema<any>
  ) => {
    try {
      schema.validateSyncAt(field, { [field]: value });
      return [];
    } catch (err: any) {
      return [err.message];
    }
  };

  const validateForm = () => {
    handleSurnameChange(surname.value);
    handleNameChange(name.value);
    handleEmailChange(email.value);
    handlePasswordChange(password.value);
    handleUsernameChange(username.value);
  };

  const isFormValid = async () => {
    let valid;
    valid =
      (await usernameSchema.isValid({ username: username.value })) &&
      (await passwordSchema.isValid({ password: password.value })) &&
      (await emailSchema.isValid({ email: email.value })) &&
      (await nameSchema.isValid({ name: name.value })) &&
      (await nameSchema.isValid({ name: surname.value }));
    return valid;
  };

  return (
    <div className="flex justify-center pt-20">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-6">
          <div>
            <label className="block text-gray-500 font-bold mb-1 pr-4">
              Profile Picture
            </label>
          </div>
          <div>
            <input
              className={clsx(
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-img"
              type="file"
              placeholder="Enter Profile Picture"
              onChange={(e) => setImg({ value: e.target.files })}
            />
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label
              className="block text-gray-500 font-bold mb-1 pr-4"
              htmlFor="inline-username"
            >
              Username
            </label>
          </div>
          <div>
            <input
              className={clsx(
                username.errors.length > 0 &&
                  "border-red-500 focus:border-red-500 text-red-500",
                username.value.length > 0 &&
                  username.errors.length === 0 &&
                  "border-green-500 focus:border-green-500 text-green-500",
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-username"
              type="text"
              placeholder="Enter Username"
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
            <div>
              {username.errors.map((err, index) => {
                return (
                  <div className="text-red-500 text-sm" key={index}>
                    {err}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="">
            <label
              className="block text-gray-500 font-bold mb-1 pr-4"
              htmlFor="inline-password"
            >
              Password
            </label>
          </div>
          <div className="">
            <input
              className={clsx(
                password.errors.length > 0 &&
                  "border-red-500 focus:border-red-500 text-red-500",
                password.value.length > 0 &&
                  password.errors.length === 0 &&
                  "border-green-500 focus:border-green-500 text-green-500",
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-password"
              type="password"
              placeholder="******************"
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <div>
              {password.errors.map((err, index) => {
                return (
                  <div className="text-red-500 text-sm" key={index}>
                    {err}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="">
            <label
              className="block text-gray-500 font-bold mb-1 pr-4"
              htmlFor="inline-email"
            >
              Email
            </label>
          </div>
          <div className="">
            <input
              className={clsx(
                email.errors.length > 0 &&
                  "border-red-500 focus:border-red-500 text-red-500",
                email.value.length > 0 &&
                  email.errors.length === 0 &&
                  "border-green-500 focus:border-green-500 text-green-500",
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-email"
              type="text"
              placeholder="Enter Email"
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <div>
              {email.errors.map((err, index) => {
                return (
                  <div className="text-red-500 text-sm" key={index}>
                    {err}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="">
            <label
              className="block text-gray-500 font-bold mb-1 pr-4"
              htmlFor="inline-name"
            >
              Name
            </label>
          </div>
          <div className="">
            <input
              className={clsx(
                name.errors.length > 0 &&
                  "border-red-500 focus:border-red-500 text-red-500",
                name.value.length > 0 &&
                  name.errors.length === 0 &&
                  "border-green-500 focus:border-green-500 text-green-500",
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-name"
              type="text"
              placeholder="Enter Name"
              onChange={(e) => handleNameChange(e.target.value)}
            />
            <div>
              {name.errors.map((err, index) => {
                return (
                  <div className="text-red-500 text-sm" key={index}>
                    {err}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="">
            <label
              className="block text-gray-500 font-bold mb-1 pr-4"
              htmlFor="inline-surname"
            >
              Surame
            </label>
          </div>
          <div className="">
            <input
              className={clsx(
                surname.errors.length > 0 &&
                  "border-red-500 focus:border-red-500 text-red-500",
                surname.value.length > 0 &&
                  surname.errors.length === 0 &&
                  "border-green-500 focus:border-green-500 text-green-500",
                "bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              )}
              id="inline-surname"
              type="text"
              placeholder="Enter Surname"
              onChange={(e) => handleSurnameChange(e.target.value)}
            />
            <div>
              {surname.errors.map((err, index) => {
                return (
                  <div className="text-red-500 text-sm" key={index}>
                    {err}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div></div>
          <div>
            <button
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Signup;
