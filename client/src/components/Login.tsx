import React, { useState } from "react";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";
import styles from "../style/SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { LoginData } from "./types";

const Login: React.FC = () => {
  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const checkData = (obj: LoginData) => {
    const { email, password } = obj;
    const urlApi = `https://lightem.senatorhost.com/login-react/index.php?email=${email.toLowerCase()}&password=${password}`;
    
    const api = axios
      .get(urlApi)
      .then((response) => response.data)
      .then((data) => 
        data.ok 
          ? notify("You login to your account successfully", "success") 
          : notify("Your password or your email is wrong", "error")
      );

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
            Don't have an account? <Link to="/signup">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;