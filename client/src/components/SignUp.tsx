import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from 'react-modal';
import "react-toastify/dist/ReactToastify.css";
import styles from "./style/SignUp.module.css";
import userIcon from "./img/user.svg";
import nameIcon from "./img/name.svg";
import surnameIcon from "./img/surname.svg";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import dateIcon from "./img/date-of-birth.svg";
import genderIcon from "./img/gender.svg";
import maleAvatar from "./img/manAvatar.png";
import femaleAvatar from "./img/womanAvatar.png";
import { validate } from "./validate";
import { notify } from "./toast";
import axiosInstance from "../api/axiosInstance";
import { SignUpData, FieldErrorResponse, CheckResponse } from "./types";

Modal.setAppElement('#root');

function debounce<Args extends unknown[], R>(
  func: (...args: Args) => R,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

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
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email) return;
    try {
      setIsCheckingEmail(true);
      const response = await axiosInstance.get<CheckResponse>('/api/auth/check-email', {
        params: { email },
      });
      if (response.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, email: "Email is already in use" }));
      } else {
        setErrors(prevErrors => {
          const rest = { ...prevErrors };
          delete rest.email;
          return rest;
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      notify("Failed to check email uniqueness", "error");
    } finally {
      setIsCheckingEmail(false);
    }
  }, []);
  const debouncedCheckEmailExists = useMemo(() => debounce(checkEmailExists, 500), [checkEmailExists]);

  const checkUsernameExists = useCallback(async (username: string) => {
    if (!username) return;
    try {
      setIsCheckingUsername(true);
      const response = await axiosInstance.get<CheckResponse>('/api/auth/check-username', {
        params: { username },
      });
      if (response.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, username: "Username is already taken" }));
      } else {
        setErrors(prevErrors => {
          const rest = { ...prevErrors };
          delete rest.username;
          return rest;
        });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      notify("Failed to check username uniqueness", "error");
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  const debouncedCheckUsernameExists = useMemo(() => debounce(checkUsernameExists, 500), [checkUsernameExists]);

  useEffect(() => {
    const localErrors = validate(data, "signUp");
    setErrors(localErrors);

    if (data.email && !localErrors.email) {
      debouncedCheckEmailExists(data.email);
    }
    if (data.username && !localErrors.username) {
      debouncedCheckUsernameExists(data.username);
    }
  }, [data, debouncedCheckEmailExists, debouncedCheckUsernameExists]);
  

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
    if (Object.keys(errors).length === 0) {
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
        } catch (error: unknown) {
          console.error('Error:', error);
          if (axios.isAxiosError<FieldErrorResponse>(error)) { // Використання генеративного типу
            if (error.response?.status === 400 && error.response.data?.errors) {
              setErrors((prevErrors) => ({ ...prevErrors, ...error.response?.data.errors }));
              notify("Please fix the errors in the form", "error");
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
          <div className={
            errors.username && touched.username
              ? styles.unCompleted
              : !errors.username && touched.username
                ? styles.completed
                : undefined
          }>
            <input
              type="text"
              name="username"
              value={data.username}
              placeholder="Username"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.username}
            />
            <img src={userIcon} className={styles.icon} alt="User icon" />
          </div>
          {errors.username && touched.username && <span className={styles.error}>{errors.username}</span>}
          {isCheckingUsername && <span className={styles.info}>Checking username...</span>}
        </div>
        <div>
          <div className={
            errors.name && touched.name
              ? styles.unCompleted
              : !errors.name && touched.name
                ? styles.completed
                : undefined
          }>
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Name"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.name}
            />
            <img src={nameIcon} className={styles.icon} alt="Name icon" />
          </div>
          {errors.name && touched.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div>
          <div className={
            errors.surname && touched.surname
              ? styles.unCompleted
              : !errors.surname && touched.surname
                ? styles.completed
                : undefined
          }>
            <input
              type="text"
              name="surname"
              value={data.surname}
              placeholder="Surname"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.surname}
            />
            <img src={surnameIcon} className={styles.icon} alt="Surname icon" />
          </div>
          {errors.surname && touched.surname && <span className={styles.error}>{errors.surname}</span>}
        </div>
        <div>
          <div className={
            errors.email && touched.email
              ? styles.unCompleted
              : !errors.email && touched.email
                ? styles.completed
                : undefined
          }>
            <input
              type="email" // Використання типу email для кращої валідації
              name="email"
              value={data.email}
              placeholder="E-mail"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.email}
            />
            <img src={emailIcon} className={styles.icon} alt="Email icon" />
          </div>
          {errors.email && touched.email && <span className={styles.error}>{errors.email}</span>}
          {isCheckingEmail && <span className={styles.info}>Checking email...</span>}
        </div>
        <div>
          <div className={
            errors.gender && touched.gender
              ? styles.unCompleted
              : !errors.gender && touched.gender
                ? styles.completed
                : styles.selectContainer
          }>
            <select
              name="gender"
              value={data.gender}
              onChange={changeHandler}
              onFocus={focusHandler}
              className={styles.select}
              aria-invalid={!!errors.gender}
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
          <div className={
            errors.dateOfBirth && touched.dateOfBirth
              ? styles.unCompleted
              : !errors.dateOfBirth && touched.dateOfBirth
                ? styles.completed
                : undefined
          }>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={changeHandler}
              onFocus={focusHandler}
              className={styles.dateInput}
              placeholder="DD/MM/YYYY"
              style={{
                color: data.dateOfBirth ? '#000' : '#bfbbbb',
              }}
              aria-invalid={!!errors.dateOfBirth}
            />
            <img src={dateIcon} alt="Date icon" />
          </div>
          {errors.dateOfBirth && touched.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
        </div>
        <div>
          <div className={
            errors.password && touched.password
              ? styles.unCompleted
              : !errors.password && touched.password
                ? styles.completed
                : undefined
          }>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.password}
            />
            <img src={passwordIcon} className={styles.icon} alt="Password icon" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div>
          <div className={
            errors.confirmPassword && touched.confirmPassword
              ? styles.unCompleted
              : !errors.confirmPassword && touched.confirmPassword
                ? styles.completed
                : undefined
          }>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              placeholder="Confirm Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
              aria-invalid={!!errors.confirmPassword}
            />
            <img src={passwordIcon} className={styles.icon} alt="Password icon" />
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
          <button type="submit" className={styles.submitButton}>Create Account</button>
          <span className={styles.loginText}>
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
        <button onClick={() => navigate('/login')} className={styles.modalButton}>Go to Login</button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SignUp;