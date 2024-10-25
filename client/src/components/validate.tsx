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
  
      if (!signUpData.name.trim()) {
        errors.name = "Username is Required!";
      } else {
        delete errors.name;
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
    }
  
    return errors;
};  