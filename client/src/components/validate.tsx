import { LoginData, SignUpData } from './types';

export const validate = (data: LoginData | SignUpData, type: "login" | "signUp"): Record<string, string> => {
    const errors: Record<string, string> = {};
  
    if (!data.email) {
      errors.email = "Email is Required!";
    } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email).toLowerCase())) {
      errors.email = "Email address is invalid!";
    } else {
      delete errors.email;
    }
  
    if (!data.password) {
      errors.password = "Password is Required";
    } else if (!(data.password.length >= 6)) {
      errors.password = "Password needs to be 6 character or more";
    } else {
      delete errors.password;
    }
  
    if (type === "signUp") {
      const signUpData = data as SignUpData;
  
      if (!signUpData.username.trim()) {
        errors.username = "Username is Required!";
      } else {
        delete errors.username;
      }

      if (!signUpData.name.trim()) {
        errors.name = "Name is Required!";
      } else if (!/^[A-Z][a-z]+$/.test(signUpData.name)) {
        errors.name = "Name must start with a capital letter!";
      }
      else {
        delete errors.name;
      }

      if (!signUpData.surname.trim()) {
        errors.surname = "Surname is Required!";
      } else if (!/^[A-Z][a-z]+$/.test(signUpData.surname)) {
        errors.surname = "Surname must start with a capital letter!";
      }else {
        delete errors.surname;
      }
  
      if (!signUpData.confirmPassword) {
        errors.confirmPassword = "Confirm the Password";
      } else if (!(signUpData.confirmPassword === signUpData.password)) {
        errors.confirmPassword = "Password does not match!";
      } else {
        delete errors.confirmPassword;
      }
  
      if (signUpData.IsAccepted) {
        delete errors.IsAccepted;
      } else {
        errors.IsAccepted = "Accept terms!";
      }
      // Перевірка гендера
      if (!signUpData.gender) {
        errors.gender = "Please select your gender";
      } else {
          delete errors.gender;
      }

      // Перевірка дати народження
      if (!signUpData.dateOfBirth) {
          errors.dateOfBirth = "Please select your date of birth";
      } else {
          // Додаткова перевірка на вік користувача (наприклад, не менше 13 років)
          const today = new Date();
          const birthDate = new Date(signUpData.dateOfBirth);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          if (age < 13) {
              errors.dateOfBirth = "You must be at least 13 years old";
          } else {
              delete errors.dateOfBirth;
          }
      }
    }
  
    return errors;
};  