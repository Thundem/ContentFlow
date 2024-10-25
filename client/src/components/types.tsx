export interface LoginData {
    email: string;
    password: string;
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    IsAccepted: boolean;
}