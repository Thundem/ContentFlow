import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import styles from "./style/SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import { LoginData } from "./types";
import axiosInstance from "../api/axiosInstance";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  console.log('Login component: login =', login);
  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const checkData = (obj: LoginData) => {
    const { email, password } = obj;
    const urlApi = `/api/auth/login`;
  
    const api = axiosInstance
      .post(urlApi, { email, password }, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.data)
      .then(async (data) => {
        if (data.token) {
          await login(data.token);
          navigate("/");
        } else {
          throw new Error("Your password or your email is wrong");
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || error.message || "Something went wrong!";
        notify(errorMessage, "error");
        throw new Error(errorMessage);
      });
  
    toast.promise(api, {
      pending: "Loading your data...",
      success: "Login successful!",
      error: "Something went wrong!",
    });
  };
  
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    checkData(data);
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign In</h2>
        <div>
          <div>
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
        </div>
        <div>
          <div>
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
        </div>

        <div>
          <button type="submit">Login</button>
          <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Don't have an account? <Link to="/register">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;