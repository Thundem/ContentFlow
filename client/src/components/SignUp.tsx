import React, { useEffect, useState } from "react";
import userIcon from "./img/user.svg";
import nameIcon from "./img/name.svg";
import surnameIcon from "./img/surname.svg";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import dateIcon from "./img/date-of-birth.svg";
import genderIcon from "./img/gender.svg";
import { validate } from "./validate";
import styles from "./style/SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { SignUpData } from "./types";
import maleAvatar from "./img/manAvatar.png";
import femaleAvatar from "./img/womanAvatar.png";
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SignUpData>({
    username: "",
    email: "",
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
    gender: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;
      setData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      const value = target.value;
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const focusHandler = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      const pushData = async () => {
        try {
          let avatarFile: File;
          if (data.gender === "MALE") {
            const response = await fetch(maleAvatar);
            const blob = await response.blob();
            avatarFile = new File([blob], "maleAvatar.png", { type: "image/png" });
          } else if (data.gender === "FEMALE") {
            const response = await fetch(femaleAvatar);
            const blob = await response.blob();
            avatarFile = new File([blob], "femaleAvatar.png", { type: "image/png" });
          } else {
            notify("Please select a gender", "error");
            return;
          }

          const formData = new FormData();
          formData.append("username", data.username);
          formData.append("email", data.email.toLowerCase());
          formData.append("name", data.name);
          formData.append("surname", data.surname);
          formData.append("password", data.password);
          formData.append("gender", data.gender);
          formData.append("dateOfBirth", data.dateOfBirth);
          formData.append("avatar", avatarFile);

          const urlApi = `/api/auth/register`;
          const response = await axiosInstance.post(urlApi, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
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
          setIsModalOpen(true);
        } catch (error) {
          console.error('Error:', error);
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              notify(error.response.data, "error");
            } else {
              notify("Something went wrong during the request", "error");
            }
          } else {
            notify("An unexpected error occurred", "error");
          }
        }
      };
      pushData();
    } else {
      notify("Please check fields again", "error");
      setTouched({
        username: true,
        email: true,
        name: true,
        surname: true,
        password: true,
        confirmPassword: true,
        IsAccepted: true,
        gender: true,
        dateOfBirth: true,
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
            <img src={userIcon} className={styles.icon} alt="User icon" />
          </div>
          {errors.username && touched.username && <span className={styles.error}>{errors.username}</span>}
        </div>
        <div>
          <div className={errors.name && touched.name ? styles.unCompleted : !errors.name && touched.name ? styles.completed : undefined}>
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Name"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={nameIcon} className={styles.icon} alt="Name icon" />
          </div>
          {errors.name && touched.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div>
          <div className={errors.surname && touched.surname ? styles.unCompleted : !errors.surname && touched.surname ? styles.completed : undefined}>
            <input
              type="text"
              name="surname"
              value={data.surname}
              placeholder="Surname"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={surnameIcon} className={styles.icon} alt="Surname icon" />
          </div>
          {errors.surname && touched.surname && <span className={styles.error}>{errors.surname}</span>}
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
          <div className={errors.gender && touched.gender ? styles.unCompleted : !errors.gender && touched.gender ? styles.completed : undefined}>
            <select
              name="gender"
              value={data.gender}
              onChange={changeHandler}
              onFocus={focusHandler}
              className={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <img src={genderIcon} alt="Gender icon" />
          </div>
          {errors.gender && touched.gender && <span className={styles.error}>{errors.gender}</span>}
        </div>
        <div>
          <div className={errors.dateOfBirth && touched.dateOfBirth ? styles.unCompleted : !errors.dateOfBirth && touched.dateOfBirth ? styles.completed : undefined}>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={changeHandler}
              onFocus={focusHandler}
              className={styles.dateInput}
            />
            <img src={dateIcon} alt="Date icon" />
          </div>
          {errors.dateOfBirth && touched.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Email Verification"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Verify Your Email</h2>
        <p>
          A verification email has been sent to your email address. Please check your inbox and click on the verification
          link to activate your account.
        </p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SignUp;