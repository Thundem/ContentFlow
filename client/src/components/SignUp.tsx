// src/components/SignUp.tsx
import React, { useEffect, useState } from "react";
import userIcon from "./img/user.svg";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import { validate } from "./validate";
import styles from "./style/SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { SignUpData } from "./types";

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Додаємо навігацію після успішної реєстрації
  const [data, setData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      const pushData = async () => {
        try {
          const urlApi = `/api/auth/register`;
          const response = await axiosInstance.post(urlApi, {
            username: data.username,
            email: data.email.toLowerCase(),
            password: data.password,
          });

          toast.promise(
            Promise.resolve(response.data),
            {
              pending: "Registering your account...",
              success: "Registration successful!",
              error: "Something went wrong!",
            }
          );

          notify("You signed up successfully", "success");
          navigate("/login");
        } catch (error) {
          console.error('Error:', error);
          notify("Something went wrong during the request", "error");
        }
      };
      pushData();
    } else {
      notify("Please check fields again", "error");
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        IsAccepted: true,
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign Up</h2>
        <div>
          <div className={errors.username && touched.username ? styles.unCompleted : !errors.username && touched.username ? styles.completed : undefined}>
            <input
              type="text"
              name="username"
              value={data.username}
              placeholder="Username"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={userIcon} alt="User icon" />
          </div>
          {errors.username && touched.username && <span className={styles.error}>{errors.username}</span>}
        </div>
        <div>
          <div className={errors.email && touched.email ? styles.unCompleted : !errors.email && touched.email ? styles.completed : undefined}>
            <input
              type="text"
              name="email"
              value={data.email}
              placeholder="E-mail"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={emailIcon} alt="Email icon" />
          </div>
          {errors.email && touched.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div>
          <div className={errors.password && touched.password ? styles.unCompleted : !errors.password && touched.password ? styles.completed : undefined}>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={passwordIcon} alt="Password icon" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div>
          <div className={errors.confirmPassword && touched.confirmPassword ? styles.unCompleted : !errors.confirmPassword && touched.confirmPassword ? styles.completed : undefined}>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              placeholder="Confirm Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={passwordIcon} alt="Password icon" />
          </div>
          {errors.confirmPassword && touched.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
        </div>
        <div>
          <div className={styles.terms}>
            <input
              type="checkbox"
              name="IsAccepted"
              checked={data.IsAccepted}
              id="accept"
              onChange={changeHandler}
              onFocus={focusHandler}
            />
            <label htmlFor="accept">I accept terms of privacy policy</label>
          </div>
          {errors.IsAccepted && touched.IsAccepted && <span className={styles.error}>{errors.IsAccepted}</span>}
        </div>
        <div>
          <button type="submit">Create Account</button>
          <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
