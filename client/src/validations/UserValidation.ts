import * as yup from "yup";

export const usernameSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
});

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
});

export const nameSchema = yup.object().shape({
  name: yup.string().required("Field is required"),
});
