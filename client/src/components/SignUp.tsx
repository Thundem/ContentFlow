import React, { useEffect, useState } from "react";
import userIcon from "./img/user.svg";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import { validate } from "./validate";
import styles from "./style/SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { SignUpData } from "./types";

const SignUp: React.FC = () => {
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
      const urlApi = `http://localhost:8080/api/auth/register?username=${data.username}&email=${data.email.toLowerCase()}&password=${data.password}`;
      const pushData = async () => {
        try {
          const response = await await axiosInstance.post(urlApi);
          const apiResponse = response.data;
          toast.promise(Promise.resolve(apiResponse), {
            pending: "Check your data",
            success: "Checked!",
            error: "Something went wrong!",
          });

          if (apiResponse.ok) {
            notify("You signed Up successfully", "success");
          } else {
            notify("You have already registered, log in to your account", "warning");
          }
        } catch (error) {
            console.error('Error:', error);
            notify("Something went wrong during the request", "error");
        }
          
      };
      pushData();
    } else {
      notify("Please check fields again", "error");
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        IsAccepted: false,
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
          {errors.name && touched.name && <span className={styles.error}>{errors.name}</span>}
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